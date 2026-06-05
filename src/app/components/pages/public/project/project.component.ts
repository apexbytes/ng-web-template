import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProjectsService } from '@core/services/projects.service';
import { ProjectTag } from '@core/dto/api.models';

@Component({
  selector: 'app-project',
  imports: [RouterLink, DatePipe],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);

  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly projectResource = resource({
    loader: () => firstValueFrom(this.projectsService.getById(this.id)),
  });

  readonly project = computed(() => this.projectResource.value()?.data ?? null);

  tagLabel(tag: ProjectTag | null): string {
    switch (tag) {
      case 'coming_soon': return 'Coming Soon';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return '';
    }
  }
}
