import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-ecs',
  imports: [RouterLink],
  templateUrl: './ecs.component.html',
  styleUrl: './ecs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcsComponent {
  private readonly seoService = inject(SeoService);
  readonly activeWhyItem = signal(0);

  constructor() {
    this.seoService.set({
      title: 'Engineering & Construction Survey',
      description: 'Precision engineering and construction survey services including setting out, as-built surveys, deformation monitoring, and infrastructure layout. Serving construction projects across South Africa.',
      keywords: 'engineering survey South Africa, construction survey, as-built survey, deformation monitoring, infrastructure survey, setting out survey',
    });
  }
}
