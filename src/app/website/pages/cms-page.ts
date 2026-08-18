import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api/api.service';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-cms-public-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <section class="dc-page-hero">
        <div class="dc-container py-10 sm:py-12">
          <div class="dc-skeleton h-4 w-28 !bg-white/10"></div>
          <div class="dc-skeleton mt-5 h-10 w-2/3 max-w-xl !bg-white/15"></div>
          <div class="dc-skeleton mt-4 h-4 w-full max-w-lg !bg-white/10"></div>
        </div>
      </section>
    } @else if (page()) {
      <section class="dc-page-hero">
        <div class="dc-container py-9 sm:py-12">
          <nav class="dc-breadcrumb" aria-label="Breadcrumb">
            <a routerLink="/">Home</a>
            <span aria-hidden="true">/</span>
            <span class="is-current">{{ page()?.title }}</span>
          </nav>
          <span class="dc-kicker !text-glow mt-5">Digital Check Nigeria</span>
          <h1 class="mt-3 max-w-3xl font-display text-3xl leading-tight text-white sm:text-5xl">
            {{ page()?.title }}
          </h1>
          @if (page()?.seo_meta?.meta_description) {
            <p class="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
              {{ page()?.seo_meta?.meta_description }}
            </p>
          }
          <div class="mt-7 flex flex-wrap gap-3">
            <a class="dc-btn-primary" routerLink="/contact">Talk to us</a>
            <a class="dc-btn-ghost" routerLink="/projects">View portfolio</a>
          </div>
        </div>
      </section>

      @for (section of page()?.sections || []; track section.id || section.key) {
        @if (section.type === 'hero') {
          <section class="dc-section relative overflow-hidden bg-forest text-white">
            <div
              class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,232,106,0.16),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(26,143,99,0.25),transparent_34%)]"
            ></div>
            <div class="dc-container relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <span class="dc-kicker !text-glow">Spotlight</span>
                <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">{{ section.title }}</h2>
                <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/78 sm:text-base">
                  {{ section.content?.subtitle }}
                </p>
                <div class="mt-7 flex flex-wrap gap-3">
                  @if (section.content?.cta_primary; as cta) {
                    <a class="dc-btn-primary" [routerLink]="cta.url || '/contact'">{{ cta.label || 'Learn more' }}</a>
                  }
                  @if (section.content?.cta_secondary; as cta) {
                    <a class="dc-btn-ghost" [routerLink]="cta.url || '/services'">{{ cta.label || 'Services' }}</a>
                  }
                </div>
              </div>
              @if (section.content?.image) {
                <div class="overflow-hidden rounded-[1.6rem] border border-white/10 shadow-lift">
                  <img
                    class="aspect-[4/3] w-full object-cover"
                    [src]="section.content.image"
                    [alt]="section.title || page()?.title || ''"
                    loading="lazy"
                  />
                </div>
              }
            </div>
          </section>
        } @else if (section.type === 'cta') {
          <section class="dc-section">
            <div class="dc-container">
              <div class="dc-panel-cta">
                <span class="dc-kicker !text-glow justify-center">Next step</span>
                <h2 class="mt-3 font-display text-3xl sm:text-4xl">{{ section.title }}</h2>
                <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {{ section.content?.text }}
                </p>
                <a class="dc-btn-primary mt-8" [routerLink]="section.content?.button?.url || '/contact'">
                  {{ section.content?.button?.label || 'Contact' }}
                </a>
              </div>
            </div>
          </section>
        } @else {
          <section class="dc-section" [class.bg-sand]="$index % 2 === 1">
            <div class="dc-container">
              @if (section.title) {
                <div class="mb-7 max-w-2xl sm:mb-9">
                  <span class="dc-kicker">{{ sectionLabel(section.type) }}</span>
                  <h2 class="dc-title mt-2.5">{{ section.title }}</h2>
                </div>
              }

              @if (section.type === 'content') {
                <div class="dc-prose" [innerHTML]="section.content?.html || ''"></div>
              }

              @if (section.type === 'values' || section.type === 'feature_list' || section.type === 'clients') {
                <ul class="grid gap-3 sm:grid-cols-2">
                  @for (item of section.content?.items || []; track item; let i = $index) {
                    <li class="dc-feature-item">
                      <span class="dc-feature-index" aria-hidden="true">{{ pad(i + 1) }}</span>
                      <span class="text-sm leading-relaxed text-ink sm:text-[0.95rem]">{{ item }}</span>
                    </li>
                  }
                </ul>
              }

              @if (section.type === 'services_grid' || section.type === 'services_overview') {
                @if (section.content?.intro) {
                  <p class="dc-lead mb-7 -mt-2">{{ section.content.intro }}</p>
                }
                <div class="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
                  @for (item of section.content?.items || []; track item.title) {
                    <a
                      class="dc-service-card group"
                      [routerLink]="item.url || '/contact'"
                      [class.pointer-events-none]="!item.url"
                      [class.cursor-default]="!item.url"
                    >
                      <div
                        class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-mist text-brand transition duration-300 group-hover:bg-brand group-hover:text-glow"
                      >
                        <i class="pi text-lg" [class]="item.icon || 'pi-check'" aria-hidden="true"></i>
                      </div>
                      <h3 class="font-display text-xl text-ink sm:text-[1.35rem]">{{ item.title }}</h3>
                      <p class="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{{ item.text || item.desc }}</p>
                      @if (item.items?.length) {
                        <ul class="mt-4 space-y-2 text-sm text-ink/80">
                          @for (sub of item.items; track sub) {
                            <li class="flex gap-2">
                              <span class="text-leaf" aria-hidden="true">✓</span>
                              <span>{{ sub }}</span>
                            </li>
                          }
                        </ul>
                      }
                      @if (item.url) {
                        <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                          Explore
                          <span class="transition group-hover:translate-x-1" aria-hidden="true">→</span>
                        </span>
                      }
                    </a>
                  }
                </div>
              }

              @if (section.type === 'stats') {
                <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                  @for (item of section.content?.items || []; track item.label) {
                    <div class="dc-stat">
                      <div class="font-display text-3xl text-brand sm:text-4xl">{{ item.value }}</div>
                      <div class="mt-2 text-xs font-medium text-muted sm:text-sm">{{ item.label }}</div>
                    </div>
                  }
                </div>
              }

              @if (section.type === 'methodology') {
                @if (section.content?.intro) {
                  <p class="dc-lead mb-7 -mt-2">{{ section.content.intro }}</p>
                }
                <ol class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  @for (item of section.content?.items || []; track item.step || item.title) {
                    <li class="rounded-[1.35rem] border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                      <div class="font-display text-2xl text-brand">{{ item.step }}</div>
                      <h3 class="mt-2.5 font-display text-lg text-ink sm:text-xl">{{ item.title }}</h3>
                      <p class="mt-2 text-sm leading-relaxed text-muted">{{ item.text }}</p>
                    </li>
                  }
                </ol>
              }
            </div>
          </section>
        }
      }

      <section class="dc-section pt-0">
        <div class="dc-container">
          <div class="grid gap-3 rounded-[1.5rem] border border-line bg-white p-5 shadow-soft sm:grid-cols-3 sm:p-6">
            <a class="rounded-2xl bg-sand/80 px-4 py-4 no-underline transition hover:bg-mist" routerLink="/projects">
              <span class="block text-xs font-bold uppercase tracking-wider text-muted">Explore</span>
              <span class="mt-1 block font-display text-xl text-ink">Portfolio</span>
            </a>
            <a class="rounded-2xl bg-sand/80 px-4 py-4 no-underline transition hover:bg-mist" routerLink="/programmes">
              <span class="block text-xs font-bold uppercase tracking-wider text-muted">Programmes</span>
              <span class="mt-1 block font-display text-xl text-ink">Outcomes</span>
            </a>
            <a class="rounded-2xl bg-sand/80 px-4 py-4 no-underline transition hover:bg-mist" routerLink="/contact">
              <span class="block text-xs font-bold uppercase tracking-wider text-muted">Partner</span>
              <span class="mt-1 block font-display text-xl text-ink">Contact us</span>
            </a>
          </div>
        </div>
      </section>
    } @else {
      <section class="dc-page-hero">
        <div class="dc-container py-12 sm:py-16">
          <span class="dc-kicker !text-glow">404</span>
          <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Page not found</h1>
          <p class="mt-3 max-w-lg text-white/75">The page you requested is not available. Try the home page, services or portfolio.</p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a routerLink="/" class="dc-btn-primary">Home</a>
            <a routerLink="/services" class="dc-btn-ghost">Services</a>
          </div>
        </div>
      </section>
    }
  `,
})
export class CmsPublicPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly page = signal<any>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.data['slug'] || this.route.snapshot.paramMap.get('slug') || 'home';
    this.api.get<any>(`public/pages/${slug}`).subscribe({
      next: (res) => {
        this.page.set(res.data);
        this.loading.set(false);
        this.seo.apply(res.data?.seo_meta, res.data?.title || 'Digital Check Nigeria');
      },
      error: () => {
        this.page.set(null);
        this.loading.set(false);
      },
    });
  }

  sectionLabel(type: string): string {
    const map: Record<string, string> = {
      content: 'Overview',
      values: 'Principles',
      feature_list: 'Capabilities',
      clients: 'Who we serve',
      services_grid: 'Services',
      services_overview: 'Services',
      stats: 'Snapshot',
      methodology: 'Delivery',
    };
    return map[type] || 'Section';
  }

  pad(n: number): string {
    return n < 10 ? `0${n}` : String(n);
  }
}
