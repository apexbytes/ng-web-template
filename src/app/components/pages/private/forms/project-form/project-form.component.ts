import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectsService } from '@core/services/projects.service';
import { Project, ProjectTag } from '@core/dto/api.models';
import { RichEditorComponent } from '@app/components/shared/rich-editor/rich-editor.component';

interface ProjectDialogData {
  project?: Project;
}

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, RichEditorComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);
  private readonly dialogRef       = inject(MatDialogRef<ProjectFormComponent>);
  private readonly data            = inject<ProjectDialogData>(MAT_DIALOG_DATA) ?? {};

  readonly isEdit      = !!this.data.project;
  readonly loading     = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl  = signal<string | null>(this.data.project?.imageUrl ?? null);

  readonly form = this.fb.group({
    title:     [this.data.project?.title     ?? '', [Validators.required, Validators.minLength(3)]],
    content:   [this.data.project?.content   ?? '', [Validators.required, Validators.minLength(10)]],
    tag:       [this.data.project?.tag       ?? ('coming_soon' as ProjectTag), Validators.required],
    sortOrder: [this.data.project?.sortOrder ?? 0, [Validators.required, Validators.min(0)]],
  });

  get titleCtrl()   { return this.form.controls['title'];   }
  get contentCtrl() { return this.form.controls['content']; }

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
    this.previewUrl.set(this.data.project?.imageUrl ?? null);
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
    const { title, content, tag, sortOrder } = this.form.getRawValue();
    const file = this.selectedFile();
    const payload = {
      title:     title!,
      content:   content!,
      tag:       tag as ProjectTag,
      sortOrder: Number(sortOrder),
      ...(file ? { image: file } : {}),
    };

    const request$ = this.isEdit
      ? this.projectsService.update(this.data.project!.id, payload)
      : this.projectsService.create(payload);

    request$.subscribe({
      next:  () => { this.loading.set(false); this.dialogRef.close(true); },
      error: () => this.loading.set(false),
    });
  }
}
