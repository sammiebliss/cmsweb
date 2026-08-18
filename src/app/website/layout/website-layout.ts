import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../core/api/api.service';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { NewsletterInlineComponent } from '../pages/forms-pages';

export interface NavItem {
  label: string;
  url?: string | null;
  children?: NavItem[];
}

@Component({
  selector: 'app-website-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, NgIf, NewsletterInlineComponent],
  templateUrl: './website-layout.html',
  styleUrl: './website-layout.scss',
})
export class WebsiteLayoutComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private routeSub?: Subscription;

  readonly settings = signal<Record<string, unknown>>({});
  readonly menuItems = signal<NavItem[]>([]);
  readonly footerItems = signal<NavItem[]>([]);
  readonly scrolled = signal(false);
  readonly openDropdown = signal<string | null>(null);
  readonly mobileExpanded = signal<string | null>(null);
  readonly showTop = signal(false);
  searchQuery = '';
  mobileOpen = false;

  private readonly fallbackHeader: NavItem[] = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    {
      label: 'Services',
      url: '/services',
      children: [
        { label: 'All Services', url: '/services' },
        { label: 'Digital Agriculture', url: '/digital-agriculture' },
        { label: 'Enterprise Technology', url: '/digital-economy' },
      ],
    },
    {
      label: 'Our Work',
      url: '/projects',
      children: [
        { label: 'Portfolio', url: '/projects' },
        { label: 'Programmes', url: '/programmes' },
        { label: 'Partners', url: '/partners' },
      ],
    },
    {
      label: 'Insights',
      url: '/news',
      children: [
        { label: 'News & Stories', url: '/news' },
        { label: 'Events', url: '/events' },
        { label: 'Publications', url: '/publications' },
        { label: 'Careers', url: '/careers' },
      ],
    },
  ];

  private readonly fallbackFooter: NavItem[] = [
    {
      label: 'Company',
      url: '/about',
      children: [
        { label: 'About Us', url: '/about' },
        { label: 'Partners', url: '/partners' },
        { label: 'Careers', url: '/careers' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    {
      label: 'Services',
      url: '/services',
      children: [
        { label: 'All Services', url: '/services' },
        { label: 'Digital Agriculture', url: '/digital-agriculture' },
        { label: 'Enterprise Technology', url: '/digital-economy' },
      ],
    },
    {
      label: 'Our Work',
      url: '/projects',
      children: [
        { label: 'Portfolio', url: '/projects' },
        { label: 'Programmes', url: '/programmes' },
      ],
    },
    {
      label: 'Resources',
      url: '/news',
      children: [
        { label: 'News & Stories', url: '/news' },
        { label: 'Events', url: '/events' },
        { label: 'Publications', url: '/publications' },
      ],
    },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY || 0;
    this.scrolled.set(y > 8);
    this.showTop.set(y > 520);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-nav-dropdown]')) {
      this.openDropdown.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openDropdown.set(null);
    if (this.mobileOpen) {
      this.setMobileOpen(false);
    }
  }

  ngOnInit(): void {
    this.api.get<{ data: Record<string, unknown> }>('settings/public').subscribe({
      next: (res) => this.settings.set(res.data || {}),
      error: () =>
        this.settings.set({
          site_name: 'Digital Check Nigeria',
          site_tagline: 'Driving Digital Transformation for Agriculture and Enterprise',
          contact_email: 'dafe@digitcheck.org',
          contact_phone: '+234 908 455 9461',
          contact_address: 'Maralago Lake City Resort, FCT, Abuja, Nigeria',
          header_cta_label: 'Talk to us',
          header_cta_url: '/contact',
        }),
    });

    this.loadMenu('header', this.menuItems, this.fallbackHeader);
    this.loadMenu('footer', this.footerItems, this.fallbackFooter);

    this.routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.openDropdown.set(null);
        this.setMobileOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    document.body.classList.remove('dc-nav-open');
  }

  siteName(): string {
    return String(this.settings()['site_name'] || 'Digital Check Nigeria');
  }

  tagline(): string {
    return String(this.settings()['site_tagline'] || 'Driving Digital Transformation for Agriculture and Enterprise');
  }

  logoUrl(): string | null {
    const logo = this.settings()['site_logo'];
    return logo ? String(logo) : null;
  }

  ctaLabel(): string {
    return String(this.settings()['header_cta_label'] || 'Talk to us');
  }

  ctaUrl(): string {
    return String(this.settings()['header_cta_url'] || '/contact');
  }

  socialLinks(): Record<string, string> | null {
    const raw = this.settings()['social_links'];
    if (raw && typeof raw === 'object') {
      return raw as Record<string, string>;
    }
    return null;
  }

  telHref(): string {
    const phone = String(this.settings()['contact_phone'] || '+2349084559461');
    return 'tel:' + phone.replace(/[^\d+]/g, '');
  }

  mailHref(): string {
    return 'mailto:' + String(this.settings()['contact_email'] || 'dafe@digitcheck.org');
  }

  toggleDropdown(label: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.openDropdown.set(this.openDropdown() === label ? null : label);
  }

  toggleMobileGroup(label: string): void {
    this.mobileExpanded.set(this.mobileExpanded() === label ? null : label);
  }

  /** Highlight parent dropdown when on its URL or any child route. */
  isNavActive(item: NavItem): boolean {
    const url = this.router.url.split('?')[0] || '/';
    if (item.url && this.pathMatches(item.url, url, item.url === '/')) {
      return true;
    }
    return (item.children || []).some((child) => child.url && this.pathMatches(child.url, url, false));
  }

  private pathMatches(link: string, current: string, exact: boolean): boolean {
    const path = link.startsWith('/') ? link : `/${link}`;
    if (exact || path === '/') {
      return current === path;
    }
    return current === path || current.startsWith(`${path}/`);
  }

  setMobileOpen(open: boolean): void {
    this.mobileOpen = open;
    document.body.classList.toggle('dc-nav-open', open);
    if (!open) {
      this.mobileExpanded.set(null);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.setMobileOpen(false);
    }
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadMenu(
    location: string,
    target: ReturnType<typeof signal<NavItem[]>>,
    fallback: NavItem[],
  ): void {
    this.api.get<any>(`public/menus/${location}`).subscribe({
      next: (res) => {
        const raw = res.data?.items || [];
        const tree = this.mapTree(raw);
        target.set(tree.length ? tree : fallback);
      },
      error: () => target.set(fallback),
    });
  }

  private mapTree(items: any[]): NavItem[] {
    return (items || [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => ({
        label: item.label,
        url: item.url || null,
        children: item.children?.length ? this.mapTree(item.children) : undefined,
      }));
  }
}
