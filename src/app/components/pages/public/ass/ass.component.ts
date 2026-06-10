import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-ass',
  imports: [RouterLink],
  templateUrl: './ass.component.html',
  styleUrl: './ass.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssComponent {
  private readonly seoService = inject(SeoService);
  readonly activeWhyItem = signal(0);

  constructor() {
    this.seoService.set({
      title: 'Aerial Security Solutions',
      description: 'Drone-based aerial security solutions for crime monitoring, surveillance, traffic management, and critical infrastructure inspection. SACAA-certified operations across South Africa by GeoMapping Pty Ltd.',
      keywords: 'aerial security South Africa, drone surveillance, crime monitoring drone, traffic management drone, infrastructure inspection UAV, SACAA security',
    });
  }
}
