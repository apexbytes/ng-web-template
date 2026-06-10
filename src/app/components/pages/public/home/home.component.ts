import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TeamService } from '@core/services/team.service';
import { ProjectsService } from '@core/services/projects.service';
import { PostsService } from '@core/services/posts.service';
import { TestimonialsService } from '@core/services/testimonials.service';
import { ProjectTag } from '@core/dto/api.models';
import { SeoService } from '@core/services/seo.service';

interface ServiceItem {
  img: string;
  num: string;
  title: string;
  desc: string;
  list: string[];
  route: string;
}

interface HeroSlide {
  img: string;
  alt: string;
  label: string;
  titleLead: string;
  titleEm: string;
  sub: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly seoService = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly teamService = inject(TeamService);
  private readonly projectsService = inject(ProjectsService);
  private readonly postsService = inject(PostsService);
  private readonly testimonialsService = inject(TestimonialsService);

  readonly heroSlides: HeroSlide[] = [
    {
      img: 'images/aerial_survey.jpg',
      alt: 'Aerial survey operations',
      label: 'WHO ARE WE',
      titleLead: "South Africa's Leading",
      titleEm: 'Geospatial Solutions Provider',
      sub: 'GeoMapping Pty Ltd is the top provider of advanced Mining Surveying, Planning, and Geospatial solutions in South Africa, leveraging over five years of industry experience and a highly qualified, SACAA-certified team.',
    },
    {
      img: 'images/2d7398e1-8ff9-4f75-9713-891b7eb1f3a5.jpg',
      alt: 'GeoMapping drone and survey field operations',
      label: 'WHAT WE OFFER',
      titleLead: 'Precision Mining &',
      titleEm: 'Aerial Survey Expertise',
      sub: 'From LiDAR and drone photogrammetry to GIS and engineering surveys, our SACAA-certified team delivers centimetre-accurate intelligence for mining, construction, and infrastructure projects nationwide.',
    },
  ];

  readonly services: ServiceItem[] = [
    {
      img: 'images/mine_survey.jpg',
      num: '01',
      title: 'Mining Surveying & Planning',
      desc: 'GeoMapping Pty Ltd provides professional mining surveying and planning solutions that support safe, efficient, and compliant mining operations across South Africa.',
      list: ['Underground and open-cast surface mine surveys', 'Volume calculations and stockpile management'],
      route: '/mining-surveying-planning',
    },
    {
      img: 'images/aerial_survey.jpg',
      num: '02',
      title: 'Aerial Survey & GIS',
      desc: 'GeoMapping Pty Ltd delivers advanced aerial survey and GIS services using drone technology, LiDAR, and spatial analysis to produce accurate geospatial intelligence.',
      list: ['High-resolution drone photogrammetry and LiDAR', 'GIS spatial analysis, orthophotography and mapping'],
      route: '/aerial-survey-gis',
    },
    {
      img: 'images/construction_survey.jpg',
      num: '03',
      title: 'Engineering Survey',
      desc: 'GeoMapping Pty Ltd provides engineering and construction survey services that support accurate project delivery from initial planning through to final completion.',
      list: ['Setting out, as-built and deformation surveys', 'Precise construction layout and infrastructure monitoring'],
      route: '/engineering-construction-survey',
    },
    {
      img: 'images/drone_survey.jpg',
      num: '04',
      title: 'Aerial Security Solutions',
      desc: 'GeoMapping Pty Ltd delivers aerial security solutions using drone technology to support crime monitoring, traffic management, and critical infrastructure oversight.',
      list: ['Drone-based crime monitoring and surveillance', 'Traffic management and infrastructure inspection'],
      route: '/aerial-security-solutions',
    },
    {
      img: 'images/communinty_programs.jpg',
      num: '05',
      title: 'Community Programs',
      desc: 'GeoMapping Pty Ltd supports community programs focused on development, skills sharing, environmental awareness, and meaningful local stakeholder engagement.',
      list: ['Skills development and geospatial training initiatives', 'Environmental awareness and community outreach programs'],
      route: '/community-programs',
    },
  ];

  readonly heroIndex = signal(0);
  readonly activeHeroSlide = computed(() => this.heroSlides[this.heroIndex()]);

  constructor() {
    this.seoService.set({
      title: 'Mining Surveying, Aerial & Geospatial Solutions in South Africa',
      description: "GeoMapping Pty Ltd is South Africa's leading provider of mining surveying, aerial survey & GIS, engineering survey, and drone security solutions. SACAA-certified team with 5+ years of experience.",
      keywords: 'mining surveying South Africa, aerial survey GIS, drone survey, LiDAR mapping, geospatial solutions, SACAA certified, orthophotography, UAV survey',
    });

    const timer = setInterval(() => this.nextHeroSlide(), 6000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  nextHeroSlide(): void {
    this.heroIndex.update(i => (i + 1) % this.heroSlides.length);
  }

  prevHeroSlide(): void {
    this.heroIndex.update(i => (i - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  goToHeroSlide(index: number): void {
    this.heroIndex.set(index);
  }

  readonly activeIndex = signal(0);
  readonly imgFading = signal(false);
  readonly activeSvc = computed(() => this.services[this.activeIndex()]);
  readonly activeWhyItem = signal(0);

  private readonly teamResource = resource({
    loader: () => firstValueFrom(this.teamService.getAll()),
  });

  private readonly projectsResource = resource({
    loader: () => firstValueFrom(this.projectsService.getAll()),
  });

  private readonly postsResource = resource({
    loader: () => firstValueFrom(this.postsService.getAll({ status: 'PUBLISHED' })),
  });

  private readonly testimonialsResource = resource({
    loader: () => firstValueFrom(this.testimonialsService.getAll()),
  });

  readonly team = computed(() =>
    this.teamResource.hasValue() ? this.teamResource.value().data ?? [] : []
  );
  readonly projects = computed(() =>
    this.projectsResource.hasValue() ? this.projectsResource.value().data ?? [] : []
  );
  readonly posts = computed(() =>
    this.postsResource.hasValue() ? this.postsResource.value().data ?? [] : []
  );
  readonly testimonials = computed(() =>
    (this.testimonialsResource.hasValue() ? this.testimonialsResource.value().data ?? [] : [])
      .filter(t => t.isActive)
  );

  selectService(index: number): void {
    if (index === this.activeIndex()) return;
    this.imgFading.set(true);
    setTimeout(() => {
      this.activeIndex.set(index);
      this.imgFading.set(false);
    }, 120);
  }

  tagLabel(tag: ProjectTag | null): string {
    switch (tag) {
      case 'coming_soon': return 'Coming Soon';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return '';
    }
  }

  socialIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'ph ph-facebook-logo';
      case 'twitter': return 'ph ph-twitter-logo';
      case 'linkedin': return 'ph ph-linkedin-logo';
      case 'instagram': return 'ph ph-instagram-logo';
      default: return 'ph ph-globe';
    }
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
  }

  excerpt(html: string, max = 140): string {
    const el = this.document.createElement('div');
    el.innerHTML = html;
    const text = (el.textContent ?? '').replace(/ /g, ' ').trim();
    if (text.length <= max) return text;
    const cut = text.lastIndexOf(' ', max);
    return text.slice(0, cut > 0 ? cut : max) + '…';
  }
}
