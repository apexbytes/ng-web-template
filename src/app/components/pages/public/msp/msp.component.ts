import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-msp',
  imports: [],
  templateUrl: './msp.component.html',
  styleUrl: './msp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MspComponent {
  private readonly seoService = inject(SeoService);
  readonly activeWhyItem = signal(0);

  constructor() {
    this.seoService.set({
      title: 'Mining Surveying & Planning',
      description: 'Professional underground and open-cast mine surveys, volume calculations, and stockpile management across South Africa. SACAA-certified aerial mining survey services by GeoMapping Pty Ltd.',
      keywords: 'mining surveying South Africa, underground mine survey, open-cast survey, stockpile volume calculation, mining planning, SACAA drone survey',
    });
  }
}
