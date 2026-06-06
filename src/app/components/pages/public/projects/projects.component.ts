import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProjectsService } from '@core/services/projects.service';
import { ProjectTag } from '@core/dto/api.models';

type FilterTag = ProjectTag | 'all';

interface FilterOption {
  label: string;
  value: FilterTag;
}

@Component({
  selector: 'app-projects',
  imports: [RouterLink, DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly document = inject(DOCUMENT);

  readonly activeFilter = signal<FilterTag>('all');
  readonly page = signal(1);
  private readonly limit = 9;

  readonly projectsResource = resource({
    params: () => ({ tag: this.activeFilter(), page: this.page() }),
    loader: ({ params }) =>
      firstValueFrom(
        this.projectsService.getAll({
          tag: params.tag === 'all' ? undefined : params.tag,
          page: params.page,
          limit: this.limit,
        })
      ),
  });

  readonly projects = computed(() => this.projectsResource.value()?.data ?? []);
  readonly meta = computed(() => this.projectsResource.value()?.meta ?? null);
  readonly totalPages = computed(() => {
    const m = this.meta();
    return m ? Math.ceil(m.total / this.limit) : 0;
  });
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly filters: FilterOption[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Coming Soon', value: 'coming_soon' },
  ];

  readonly skeletons = [1, 2, 3, 4, 5, 6];

  setFilter(tag: FilterTag): void {
    this.activeFilter.set(tag);
    this.page.set(1);
  }

  setPage(p: number): void {
    this.page.set(p);
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tagLabel(tag: ProjectTag | null): string {
    switch (tag) {
      case 'coming_soon': return 'Coming Soon';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return '';
    }
  }
}
