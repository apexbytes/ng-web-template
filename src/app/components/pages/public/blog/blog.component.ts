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
import { PostsService } from '@core/services/posts.service';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly postResource = resource({
    loader: () => firstValueFrom(this.postsService.getById(this.id)),
  });

  readonly post = computed(() => this.postResource.value()?.data ?? null);
}
