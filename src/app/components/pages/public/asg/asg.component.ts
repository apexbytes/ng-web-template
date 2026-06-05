import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-asg',
  imports: [],
  templateUrl: './asg.component.html',
  styleUrl: './asg.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsgComponent {
  private readonly seoService = inject(SeoService);
  readonly activeWhyItem = signal(0);

  constructor() {
    this.seoService.set({
      title: 'Aerial Survey & GIS Services',
      description: 'Advanced aerial survey and GIS services using drone photogrammetry, LiDAR scanning, GIS spatial analysis, and orthophotography. SACAA-certified operations across South Africa by GeoMapping Pty Ltd.',
      keywords: 'aerial survey South Africa, drone photogrammetry, LiDAR scanning, GIS mapping, orthophotography, UAV survey, geospatial data',
    });
  }
}
