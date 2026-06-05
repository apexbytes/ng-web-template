import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStore } from '@core/stores/auth.store';
import { PostsService } from '@core/services/posts.service';
import { ProjectsService } from '@core/services/projects.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly postsService = inject(PostsService);
  private readonly teamService = inject(TeamService);

  readonly user = inject(AuthStore).user;

  readonly stats = toSignal(
    forkJoin({
      projects: this.projectsService.getAll({ limit: 1 }),
      posts: this.postsService.getAll({ limit: 1 }),
      published: this.postsService.getAll({ status: 'PUBLISHED', limit: 1 }),
      team: this.teamService.getAll(),
    }).pipe(
      map(r => ({
        projects: r.projects.meta.total,
        posts: r.posts.meta.total,
        published: r.published.meta.total,
        team: r.team.data.length,
      })),
      catchError(() => of(null))
    )
  );
}
