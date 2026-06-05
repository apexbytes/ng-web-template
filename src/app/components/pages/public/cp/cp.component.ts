import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-cp',
  imports: [],
  templateUrl: './cp.component.html',
  styleUrl: './cp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpComponent {
  private readonly seoService = inject(SeoService);
  readonly activeWhyItem = signal(0);

  constructor() {
    this.seoService.set({
      title: 'Community Programs',
      description: "GeoMapping's community programs deliver geospatial skills development, training initiatives, environmental awareness, and local stakeholder engagement across South Africa.",
      keywords: 'geospatial skills development South Africa, community survey programs, geomapping outreach, environmental awareness surveying',
    });
  }
}
