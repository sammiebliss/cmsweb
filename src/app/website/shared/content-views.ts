import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, NgIf],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a>
          <span aria-hidden="true">/</span>
          <span class="is-current">{{ pageTitle }}</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Digital Check Nigeria</span>
        <h1 class="mt-3 max-w-3xl font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
          {{ pageTitle }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">{{ pageSubtitle }}</p>
        <div class="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row sm:items-center" *ngIf="showSearch">
          <label class="sr-only" [for]="'search-' + basePath">Search {{ pageTitle }}</label>
          <input
            class="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-glow/40 focus:ring-2 focus:ring-glow/20"
            [id]="'search-' + basePath"
            [(ngModel)]="q"
            (keyup.enter)="load()"
            [placeholder]="'Search ' + pageTitle.toLowerCase() + '…'"
          />
          <button type="button" class="dc-btn-primary !min-h-11 shrink-0" (click)="load()">Search</button>
        </div>
      </div>
    </section>

    <section class="dc-section">
      <div class="dc-container">
        <div class="mb-6 flex items-center justify-between gap-3 text-sm text-muted" *ngIf="!loading()">
          <span
            >{{ items().length }} result{{ items().length === 1 ? '' : 's'
            }}{{ q ? ' for “' + q + '”' : '' }}</span
          >
          <button
            *ngIf="q"
            type="button"
            class="font-semibold text-brand underline-offset-2 hover:underline"
            (click)="clearSearch()"
          >
            Clear search
          </button>
        </div>

        @if (loading()) {
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            @for (s of [1, 2, 3, 4, 5, 6]; track s) {
              <div class="overflow-hidden rounded-[1.5rem] border border-line">
                <div class="dc-skeleton aspect-[16/10] !rounded-none"></div>
                <div class="space-y-2 p-5">
                  <div class="dc-skeleton h-4 w-20"></div>
                  <div class="dc-skeleton h-6 w-4/5"></div>
                  <div class="dc-skeleton h-4 w-full"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            @for (item of items(); track item.id) {
              <a class="dc-media-card group" [routerLink]="[basePath, item.slug]">
                <div class="relative aspect-[16/10] overflow-hidden bg-mist">
                  <img
                    *ngIf="cover(item) as src"
                    class="dc-cover transition duration-700 group-hover:scale-105"
                    [src]="src"
                    [alt]="item[titleField] || item.title || item.name || ''"
                    loading="lazy"
                  />
                  <div
                    *ngIf="!cover(item)"
                    class="absolute inset-0 bg-gradient-to-br from-forest via-brand to-leaf/60"
                  ></div>
                </div>
                <div class="p-5 sm:p-6">
                  <span class="dc-chip">{{ metaLabel(item) }}</span>
                  <h2 class="mt-3 font-display text-xl leading-snug text-ink">
                    {{ item[titleField] || item.title || item.name }}
                  </h2>
                  <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{{ summary(item) }}</p>
                  <div class="mt-4 flex items-center justify-between gap-2">
                    <span class="text-xs font-medium text-muted" *ngIf="item.published_at || item.starts_at">
                      {{ (item.starts_at || item.published_at) | date: 'mediumDate' }}
                    </span>
                    <span class="text-sm font-semibold text-brand">
                      View <span class="transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </a>
            } @empty {
              <div class="dc-empty sm:col-span-2 xl:col-span-3">
                <p class="font-medium text-ink">No published items yet.</p>
                <p class="mt-1 max-w-md text-sm text-muted">Check back soon, or explore other sections of our work.</p>
                <a routerLink="/" class="dc-btn-outline mt-5">Back to home</a>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class ContentListComponent implements OnInit {
  @Input({ required: true }) endpoint!: string;
  @Input({ required: true }) basePath!: string;
  @Input() pageTitle = 'Content';
  @Input() pageSubtitle = '';
  @Input() titleField: 'title' | 'name' = 'title';
  @Input() showSearch = true;
  @Input() extraParams: Record<string, string | number | boolean> = {};

  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  readonly items = signal<any[]>([]);
  readonly loading = signal(true);
  q = '';

  ngOnInit(): void {
    this.seo.apply({ meta_title: `${this.pageTitle} | Digital Check Nigeria` });
    this.load();
  }

  cover(item: any): string | null {
    return item.featured_image || null;
  }

  summary(item: any): string {
    const text = item.excerpt || item.summary || item.description || item.client || '';
    return String(text).slice(0, 160) + (String(text).length > 160 ? '…' : '');
  }

  metaLabel(item: any): string {
    return item.sector || item.client || item.type || item.location || item.department || item.category || 'Featured';
  }

  clearSearch(): void {
    this.q = '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.get<any>(this.endpoint, { q: this.q || undefined, per_page: 12, ...this.extraParams }).subscribe({
      next: (res) => {
        this.items.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      },
    });
  }
}

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, NgIf],
  template: `
    @if (!item() && loading()) {
      <section class="dc-page-hero">
        <div class="dc-container py-10">
          <div class="dc-skeleton h-4 w-28 !bg-white/10"></div>
          <div class="dc-skeleton mt-5 h-10 w-2/3 max-w-xl !bg-white/15"></div>
        </div>
      </section>
    }

    @if (item(); as data) {
      <section class="dc-page-hero">
        <div class="dc-container py-9 sm:py-12">
          <a [routerLink]="basePath" class="dc-back">← Back to {{ listLabel }}</a>
          <span class="dc-chip !bg-white/10 !text-glow" *ngIf="data.sector || data.client || data.type">
            {{ data.sector || data.type || data.client }}
          </span>
          <h1 class="mt-3 max-w-4xl font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            {{ data[titleField] || data.title || data.name || '…' }}
          </h1>
          <p
            class="mt-4 text-sm text-white/75 sm:text-base"
            *ngIf="data.published_at || data.starts_at || data.location || data.client || data.geography || data.funder"
          >
            <span *ngIf="data.client">{{ data.client }}</span>
            <span *ngIf="data.funder">{{ data.funder }}</span>
            <span *ngIf="(data.client || data.funder) && (data.location || data.geography)"> · </span>
            <span *ngIf="data.location || data.geography">{{ data.location || data.geography }}</span>
            <span *ngIf="(data.client || data.funder || data.location || data.geography) && (data.published_at || data.starts_at)">
              ·
            </span>
            <span *ngIf="data.published_at || data.starts_at">
              {{ (data.starts_at || data.published_at) | date: 'fullDate' }}
            </span>
          </p>
        </div>
      </section>

      <section class="dc-section">
        <div class="dc-container">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start">
            <article class="min-w-0">
              <div
                class="mb-7 overflow-hidden rounded-[1.5rem] border border-line shadow-soft"
                *ngIf="data.featured_image"
              >
                <img
                  class="aspect-[21/9] w-full object-cover"
                  [src]="data.featured_image"
                  [alt]="data.name || data.title || ''"
                  loading="lazy"
                />
              </div>

              <p class="text-lg leading-relaxed text-muted" *ngIf="data.excerpt || data.summary || data.description">
                {{ data.excerpt || data.summary || data.description }}
              </p>

              <div
                class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"
                *ngIf="data.impact_metrics?.length || data.statistics?.length"
              >
                @for (m of data.impact_metrics || data.statistics || []; track m.label) {
                  <div class="dc-stat !p-4">
                    <div class="font-display text-2xl text-brand">{{ m.value }}</div>
                    <div class="mt-1 text-xs text-muted">{{ m.label }}</div>
                  </div>
                }
              </div>

              <div class="dc-prose mt-10" *ngIf="data.challenge">
                <h2>Challenge</h2>
                <p>{{ data.challenge }}</p>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.solution">
                <h2>Solution</h2>
                <p>{{ data.solution }}</p>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.objectives">
                <h2>Objectives</h2>
                <div [innerHTML]="toHtml(data.objectives)"></div>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.deliverables">
                <h2>Deliverables</h2>
                <div [innerHTML]="toHtml(data.deliverables)"></div>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.beneficiaries">
                <h2>Beneficiaries</h2>
                <p>{{ data.beneficiaries }}</p>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.results">
                <h2>Results</h2>
                <p>{{ data.results }}</p>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.body">
                <div [innerHTML]="data.body"></div>
              </div>

              <div class="dc-prose mt-2" *ngIf="data.requirements">
                <h2>Requirements</h2>
                <div [innerHTML]="data.requirements"></div>
              </div>

              <div class="mt-8 flex flex-wrap gap-2" *ngIf="data.technologies?.length">
                @for (tech of data.technologies; track tech) {
                  <span class="dc-chip">{{ tech }}</span>
                }
              </div>
            </article>

            <aside class="lg:sticky lg:top-24">
              <div class="rounded-[1.35rem] border border-line bg-white p-5 shadow-soft">
                <p class="text-xs font-bold uppercase tracking-[0.16em] text-muted">Actions</p>
                <div class="mt-4 flex flex-col gap-2.5">
                  <a
                    class="dc-btn-dark !w-full"
                    *ngIf="endpoint.includes('publications')"
                    [href]="downloadUrl(data.slug)"
                    target="_blank"
                    rel="noopener"
                    >Download</a
                  >
                  <a
                    class="dc-btn-dark !w-full"
                    *ngIf="endpoint.includes('events')"
                    [routerLink]="['/events', data.slug, 'register']"
                    >Register</a
                  >
                  <a
                    class="dc-btn-dark !w-full"
                    *ngIf="endpoint.includes('careers')"
                    [routerLink]="['/careers', data.slug, 'apply']"
                    >Apply</a
                  >
                  <a class="dc-btn-outline !w-full" routerLink="/contact">Discuss similar work</a>
                  <a class="dc-btn-outline !w-full" [routerLink]="basePath">Back to list</a>
                </div>
                <p class="mt-5 text-xs leading-relaxed text-muted">
                  Based in Abuja, Digital Check Nigeria supports digital agriculture, platforms and programme delivery nationwide.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="dc-section pt-0">
        <div class="dc-container">
          <div class="dc-panel-cta">
            <span class="dc-kicker !text-glow justify-center">Work with us</span>
            <h2 class="mt-3 font-display text-3xl sm:text-4xl">Need something similar?</h2>
            <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              Share your context and goals — we will propose a practical delivery approach.
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
              <a class="dc-btn-primary" routerLink="/contact">Talk to us</a>
              <a class="dc-btn-ghost" routerLink="/services">Our services</a>
            </div>
          </div>
        </div>
      </section>
    } @else if (!loading()) {
      <section class="dc-section">
        <div class="dc-container">
          <div class="dc-empty">
            <p class="font-medium text-ink">Content not found</p>
            <a [routerLink]="basePath" class="dc-btn-outline mt-4">Back to list</a>
          </div>
        </div>
      </section>
    }
  `,
})
export class ContentDetailComponent implements OnInit {
  @Input({ required: true }) endpoint!: string;
  @Input({ required: true }) basePath!: string;
  @Input() titleField: 'title' | 'name' = 'title';

  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly item = signal<any>(null);
  readonly loading = signal(true);

  get listLabel(): string {
    const path = this.basePath.replace(/^\//, '');
    if (!path) {
      return 'list';
    }
    return path.charAt(0).toUpperCase() + path.slice(1);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.get<any>(`${this.endpoint}/${slug}`).subscribe({
      next: (res) => {
        this.item.set(res.data);
        this.loading.set(false);
        this.seo.apply(res.data?.seo_meta, res.data?.[this.titleField] || res.data?.title);
      },
      error: () => {
        this.item.set(null);
        this.loading.set(false);
      },
    });
  }

  downloadUrl(slug: string): string {
    return `${environment.apiUrl}/public/publications/${slug}/download`;
  }

  toHtml(value: string): string {
    if (!value) {
      return '';
    }
    if (value.includes('<')) {
      return value;
    }
    return (
      '<ul>' +
      value
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => `<li>${line}</li>`)
        .join('') +
      '</ul>'
    );
  }
}
