import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostsService } from '@core/services/posts.service';
import { Post, PostStatus } from '@core/dto/api.models';
import { RichEditorComponent } from '@app/components/shared/rich-editor/rich-editor.component';

interface PostDialogData {
  post?: Post;
}

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, RichEditorComponent],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly postsService = inject(PostsService);
  private readonly dialogRef   = inject(MatDialogRef<PostFormComponent>);
  private readonly data        = inject<PostDialogData>(MAT_DIALOG_DATA) ?? {};

  readonly isEdit      = !!this.data.post;
  readonly loading     = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl  = signal<string | null>(this.data.post?.imageUrl ?? null);

  readonly form = this.fb.group({
    title:   [this.data.post?.title   ?? '', [Validators.required, Validators.minLength(3)]],
    content: [this.data.post?.content ?? '', [Validators.required, Validators.minLength(10)]],
    status:  [this.data.post?.status  ?? ('DRAFT' as PostStatus), Validators.required],
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
    this.previewUrl.set(this.data.post?.imageUrl ?? null);
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
    const { title, content, status } = this.form.getRawValue();
    const file = this.selectedFile();
    const payload = {
      title:   title!,
      content: content!,
      status:  status as PostStatus,
      ...(file ? { image: file } : {}),
    };

    const request$ = this.isEdit
      ? this.postsService.update(this.data.post!.id, payload)
      : this.postsService.create(payload);

    request$.subscribe({
      next:  () => { this.loading.set(false); this.dialogRef.close(true); },
      error: () => this.loading.set(false),
    });
  }
}
