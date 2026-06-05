import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PostsService } from '@core/services/posts.service';
import { Post } from '@core/dto/api.models';
import { createPagination } from '@core/utils/pagination.util';
import { PostFormComponent } from './forms/post-form.component';
import { ConfirmDialogComponent } from '../forms/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-posts',
  imports: [DatePipe],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  private readonly postsService = inject(PostsService);
  private readonly dialog       = inject(MatDialog);

  readonly pagination = createPagination(1, 10);

  readonly postsResource = rxResource({
    params: () => this.pagination.params(),
    stream: ({ params }) => this.postsService.getAll(params),
  });

  readonly posts = computed(() => this.postsResource.value()?.data ?? []);
  readonly meta  = computed(() => this.postsResource.value()?.meta ?? null);

  readonly totalPages = computed(() =>
    Math.ceil((this.meta()?.total ?? 0) / this.pagination.limit())
  );

  readonly showingFrom = computed(() => {
    const m = this.meta();
    return m ? (m.page - 1) * m.limit + 1 : 0;
  });

  readonly showingTo = computed(() => {
    const m = this.meta();
    return m ? Math.min(m.page * m.limit, m.total) : 0;
  });

  readonly pageRange = computed((): (number | null)[] => {
    const total = this.totalPages();
    const cur   = this.pagination.page();
    if (total <= 1) return [];
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 3)         return [1, 2, 3, 4, null, total];
    if (cur >= total - 2) return [1, null, total - 3, total - 2, total - 1, total];
    return [1, null, cur - 1, cur, cur + 1, null, total];
  });

  private openForm(post?: Post): void {
    const ref = this.dialog.open(PostFormComponent, {
      disableClose: true,
      maxHeight: '90vh',
      maxWidth: '1400px',
      width: '95%',
      panelClass: 'full-screen-modal',
      data: post ? { post } : undefined,
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) this.postsResource.reload();
    });
  }

  openCreate(): void  { this.openForm(); }
  openEdit(post: Post): void { this.openForm(post); }

  deletePost(id: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '90%',
      maxWidth: '400px',
      data: { message: 'Delete this post? This cannot be undone.' },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.postsService.delete(id).subscribe({
        next: () => this.postsResource.reload(),
      });
    });
  }
}
