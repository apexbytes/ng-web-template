import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SeoService } from '@core/services/seo.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly seoService = inject(SeoService);
  private readonly teamService = inject(TeamService);

  constructor() {
    this.seoService.set({
      title: 'About Us',
      description: "Learn about GeoMapping Pty Ltd — South Africa's leading geospatial solutions provider. Discover our SACAA-certified team, 5+ years of industry expertise, and our operations in Mpumalanga and KwaZulu-Natal.",
      keywords: 'about GeoMapping, South Africa surveying company, SACAA certified, geospatial company, mining survey South Africa',
    });
  }

  private readonly teamResource = resource({
    loader: () => firstValueFrom(this.teamService.getAll()),
  });

  readonly team = computed(() => this.teamResource.value()?.data ?? []);
  readonly teamLoading = computed(() => this.teamResource.isLoading());

  socialIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'ph ph-facebook-logo';
      case 'twitter': return 'ph ph-twitter-logo';
      case 'linkedin': return 'ph ph-linkedin-logo';
      case 'instagram': return 'ph ph-instagram-logo';
      default: return 'ph ph-globe';
    }
  }
}
