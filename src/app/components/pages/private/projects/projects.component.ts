import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from '@core/services/projects.service';
import { Project, ProjectTag } from '@core/dto/api.models';
import { createPagination } from '@core/utils/pagination.util';
import { ProjectFormComponent } from '../forms/project-form/project-form.component';
import { ConfirmDialogComponent } from '../forms/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects',
  imports: [DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly dialog          = inject(MatDialog);

  readonly pagination = createPagination(1, 10);

  readonly projectsResource = rxResource({
    params: () => this.pagination.params(),
    stream: ({ params }) => this.projectsService.getAll(params),
  });

  readonly projects = computed(() => this.projectsResource.value()?.data ?? []);
  readonly meta     = computed(() => this.projectsResource.value()?.meta ?? null);

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

  tagBadgeClass(tag: ProjectTag | null): string {
    switch (tag) {
      case 'completed':   return 'status-badge badge-completed';
      case 'in_progress': return 'status-badge badge-in-progress';
      case 'coming_soon': return 'status-badge badge-coming-soon';
      default:            return 'status-badge badge-draft';
    }
  }

  tagLabel(tag: ProjectTag | null): string {
    switch (tag) {
      case 'completed':   return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'coming_soon': return 'Coming Soon';
      default:            return 'Untagged';
    }
  }

  private openForm(project?: Project): void {
    const ref = this.dialog.open(ProjectFormComponent, {
      disableClose: true,
      maxHeight: '90vh',
      maxWidth: '1400px',
      width: '95%',
      panelClass: 'full-screen-modal',
      data: project ? { project } : undefined,
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) this.projectsResource.reload();
    });
  }

  openCreate(): void  { this.openForm(); }
  openEdit(project: Project): void { this.openForm(project); }

  deleteProject(id: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '90%',
      maxWidth: '400px',
      data: { message: 'Delete this project? This cannot be undone.' },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.projectsService.delete(id).subscribe({
        next: () => this.projectsResource.reload(),
      });
    });
  }
}
