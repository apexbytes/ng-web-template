import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:resize)': 'onResize()',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);
  readonly servicesOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');

  private readonly hamburgerEl = viewChild<ElementRef>('hamburger');
  private readonly mobileNavEl = viewChild<ElementRef>('mobileNav');
  private readonly searchInputEl = viewChild<ElementRef>('searchInput');

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart), takeUntilDestroyed())
      .subscribe(() => { this.closeMenu(); this.closeSearch(); });

    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });

    effect(() => {
      if (this.searchOpen()) {
        setTimeout(() => this.searchInputEl()?.nativeElement.focus(), 50);
      }
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
    if (!this.menuOpen()) this.servicesOpen.set(false);
  }

  toggleServices(event: Event): void {
    event.preventDefault();
    this.servicesOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.servicesOpen.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.update(open => !open);
    if (!this.searchOpen()) this.searchQuery.set('');
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onEscape(): void {
    if (this.searchOpen()) { this.closeSearch(); return; }
    if (this.menuOpen()) this.closeMenu();
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    const hamburger = this.hamburgerEl()?.nativeElement;
    const mobileNav = this.mobileNavEl()?.nativeElement;
    if (!hamburger?.contains(event.target as Node) && !mobileNav?.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  onResize(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) > 768) {
      this.closeMenu();
    }
  }
}
