import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '@core/services/team.service';
import { TeamMember, Social } from '@core/dto/api.models';

interface TeamDialogData {
  member?: TeamMember;
}

@Component({
  selector: 'app-team-form',
  imports: [ReactiveFormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFormComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly teamService = inject(TeamService);
  private readonly dialogRef   = inject(MatDialogRef<TeamFormComponent>);
  private readonly data        = inject<TeamDialogData>(MAT_DIALOG_DATA) ?? {};

  readonly isEdit      = !!this.data.member;
  readonly loading     = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl  = signal<string | null>(this.data.member?.imageUrl ?? null);

  readonly form = this.fb.group({
    name:      [this.data.member?.name      ?? '', [Validators.required, Validators.minLength(3)]],
    title:     [this.data.member?.title     ?? '', [Validators.required]],
    sortOrder: [this.data.member?.sortOrder ?? 0,  [Validators.required, Validators.min(0)]],
    socials:   this.fb.array(
      (this.data.member?.socials ?? []).map(s => this.fb.group({
        platform: [s.platform, Validators.required],
        link:     [s.link,     Validators.required],
      }))
    ),
  });

  get nameCtrl()    { return this.form.controls['name']; }
  get titleCtrl()   { return this.form.controls['title']; }
  get socialsArray() { return this.form.controls['socials'] as FormArray; }

  addSocial(): void {
    this.socialsArray.push(this.fb.group({
      platform: ['', Validators.required],
      link:     ['', Validators.required],
    }));
  }

  removeSocial(index: number): void {
    this.socialsArray.removeAt(index);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile.set(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(this.data.member?.imageUrl ?? null);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { name, title, sortOrder, socials } = this.form.getRawValue();
    const file = this.selectedFile();
    const payload = {
      name:      name!,
      title:     title!,
      sortOrder: Number(sortOrder),
      socials:   socials as Social[],
      ...(file ? { image: file } : {}),
    };

    const request$ = this.isEdit
      ? this.teamService.update(this.data.member!.id, payload)
      : this.teamService.create(payload);

    request$.subscribe({
      next:  () => { this.loading.set(false); this.dialogRef.close(true); },
      error: () => this.loading.set(false),
    });
  }
}
