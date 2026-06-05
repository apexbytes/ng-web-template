import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly seoService = inject(SeoService);

  constructor() {
    this.seoService.set({
      title: 'About Us',
      description: "Learn about GeoMapping Pty Ltd — South Africa's leading geospatial solutions provider. Discover our SACAA-certified team, 5+ years of industry expertise, and our operations in Mpumalanga and KwaZulu-Natal.",
      keywords: 'about GeoMapping, South Africa surveying company, SACAA certified, geospatial company, mining survey South Africa',
    });
  }
}
