import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { SeoService } from '../../core/seo/seo.service';

interface PageSection {
  type: string;
  title?: string;
  content?: any;
}

const API_ORIGIN = environment.apiUrl.replace(/\/api\/v1\/?$/, '');
const FALLBACK_HERO = `${API_ORIGIN}/media/nigeria/hero-farmers.jpg`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  readonly page = signal<any>(null);
  readonly settings = signal<Record<string, unknown>>({});
  readonly featuredNews = signal<any[]>([]);
  readonly featuredProjects = signal<any[]>([]);
  readonly programmes = signal<any[]>([]);
  readonly partners = signal<any[]>([]);
  readonly testimonials = signal<any[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.get<{ data: Record<string, unknown> }>('settings/public').subscribe({
      next: (res) => this.settings.set(res.data || {}),
      error: () => this.settings.set({}),
    });

    this.api.get<any>('public/pages/home').subscribe({
      next: (res) => {
        this.page.set(res.data);
        this.seo.apply(res.data?.seo_meta, res.data?.title || 'Digital Check Nigeria');
      },
      error: () => {
        this.page.set({
          title: 'Home',
          sections: [
            {
              type: 'hero',
              title: 'Driving Digital Transformation for Agriculture and Enterprise',
              content: {
                subtitle:
                  'ICT solutions for agriculture, development programmes and enterprise technology services.',
                cta_primary: { label: 'Our Services', url: '/services' },
                cta_secondary: { label: 'View Portfolio', url: '/projects' },
                image: FALLBACK_HERO,
              },
            },
          ],
        });
        this.seo.apply(null, 'Digital Check Nigeria');
      },
    });

    this.api.get<any>('public/news', { featured: true, per_page: 3 }).subscribe({
      next: (res) => this.featuredNews.set(res.data || []),
      error: () => this.featuredNews.set([]),
    });
    this.api.get<any>('public/projects', { featured: true, per_page: 6 }).subscribe({
      next: (res) => {
        this.featuredProjects.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.featuredProjects.set([]);
        this.loading.set(false);
      },
    });
    this.api.get<any>('public/programmes', { featured: true, per_page: 3 }).subscribe({
      next: (res) => this.programmes.set(res.data || []),
      error: () => this.programmes.set([]),
    });
    this.api.get<any>('public/partners').subscribe({
      next: (res) => this.partners.set((res.data || []).slice(0, 8)),
      error: () => this.partners.set([]),
    });
    this.api.get<any>('public/testimonials').subscribe({
      next: (res) => this.testimonials.set(res.data || []),
      error: () => this.testimonials.set([]),
    });

    this.api.post('public/analytics/track', { event: 'page_view', path: '/' }).subscribe({ error: () => undefined });
  }

  sections(): PageSection[] {
    return this.page()?.sections || [];
  }

  hero(): PageSection | undefined {
    return this.sections().find((s) => s.type === 'hero');
  }

  heroImage(): string {
    return (
      this.hero()?.content?.image ||
      (this.settings()['brand_cover_image'] ? String(this.settings()['brand_cover_image']) : '') ||
      FALLBACK_HERO
    );
  }

  siteBrand(): string {
    return String(this.settings()['site_name'] || 'Digital Check Nigeria');
  }

  hasCtaSection(): boolean {
    return this.sections().some((s) => s.type === 'cta');
  }

  initials(name?: string): string {
    const value = (name || 'C').trim();
    return value.charAt(0).toUpperCase() || 'C';
  }
}
