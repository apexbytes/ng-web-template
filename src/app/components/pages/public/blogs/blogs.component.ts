import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PostsService } from '@core/services/posts.service';

@Component({
  selector: 'app-blogs',
  imports: [RouterLink, DatePipe],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogsComponent {
  private readonly postsService = inject(PostsService);
  private readonly document = inject(DOCUMENT);

  readonly page = signal(1);
  private readonly limit = 9;

  readonly postsResource = resource({
    params: () => ({ page: this.page() }),
    loader: ({ params }) =>
      firstValueFrom(
        this.postsService.getAll({ status: 'PUBLISHED', page: params.page, limit: this.limit })
      ),
  });

  readonly posts = computed(() => this.postsResource.value()?.data ?? []);
  readonly meta = computed(() => this.postsResource.value()?.meta ?? null);
  readonly totalPages = computed(() => {
    const m = this.meta();
    return m ? Math.ceil(m.total / this.limit) : 0;
  });
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly skeletons = [1, 2, 3, 4, 5, 6];

  setPage(p: number): void {
    this.page.set(p);
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excerpt(html: string, max = 130): string {
    const el = this.document.createElement('div');
    el.innerHTML = html;
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text.length <= max) return text;
    const cut = text.lastIndexOf(' ', max);
    return text.slice(0, cut > 0 ? cut : max) + '…';
  }
}
