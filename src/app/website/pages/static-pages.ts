import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';
import { SeoService } from '../../core/seo/seo.service';
import { RouterLink } from '@angular/router';

/** Fallback static pages — primary about/services routes use CMS pages. */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">About</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Company</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">About Digital Check Nigeria</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          ICT and digital transformation for agriculture, enterprise systems and programme delivery.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container max-w-3xl">
        <div class="dc-prose">
          <h2>Who we are</h2>
          <p>
            Digital Check Nigeria designs, deploys and supports practical digital solutions for agriculture,
            development programmes, businesses and mainstream IT service needs.
          </p>
          <h2>Vision</h2>
          <p>A digitally empowered society where technology strengthens institutions, livelihoods and development outcomes.</p>
          <h2>Mission</h2>
          <p>
            To design and deliver practical digital solutions that help governments, partners and enterprises scale impact.
          </p>
        </div>
        <div class="mt-10 flex flex-wrap gap-3">
          <a routerLink="/services" class="dc-btn-dark">Services</a>
          <a routerLink="/contact" class="dc-btn-outline">Contact</a>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'About | Digital Check Nigeria', meta_description: 'About Digital Check Nigeria' });
  }
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Services</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">What we deliver</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Services</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          End-to-end digital solutions across agriculture, ICT consulting and enterprise systems.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          @for (s of services; track s.title) {
            <div class="dc-service-card">
              <h2 class="font-display text-2xl text-ink">{{ s.title }}</h2>
              <p class="mt-2 text-sm text-muted">{{ s.desc }}</p>
              <ul class="mt-4 space-y-2 text-sm text-ink/80">
                @for (i of s.items; track i) {
                  <li class="flex gap-2"><span class="text-leaf">✓</span>{{ i }}</li>
                }
              </ul>
            </div>
          }
        </div>
        <div class="mt-12">
          <div class="dc-panel-cta">
            <h2 class="font-display text-3xl">Need a tailored delivery approach?</h2>
            <p class="mx-auto mt-3 max-w-xl text-white/85">Tell us about your programme, platform or operations challenge.</p>
            <a routerLink="/contact" class="dc-btn-primary mt-7">Talk to us</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ServicesComponent implements OnInit {
  private readonly seo = inject(SeoService);
  services = [
    {
      title: 'Digital Agriculture',
      desc: 'Farmer systems, advisory and dashboards.',
      items: ['Farmer Registration', 'AI Advisory', 'Extension Systems', 'Agricultural Dashboards'],
    },
    {
      title: 'ICT Consulting',
      desc: 'Strategy and transformation support.',
      items: ['Digital Strategy', 'BPR', 'Technology Advisory', 'Digital Transformation'],
    },
    {
      title: 'Software Development',
      desc: 'Products and enterprise platforms.',
      items: ['Websites & Portals', 'Web Apps', 'Workflow Platforms', 'Dashboards'],
    },
    {
      title: 'Data Systems',
      desc: 'Measurement and data quality systems.',
      items: ['M&E Systems', 'Kobo/ODK', 'KPI Tracking', 'Data Quality'],
    },
    {
      title: 'Managed ICT Services',
      desc: 'Reliable day-to-day technology operations.',
      items: ['IT Support', 'Networking', 'Cloud', 'Cybersecurity'],
    },
    {
      title: 'Capacity Building',
      desc: 'Skills for lasting change.',
      items: ['Digital Literacy', 'Staff Training', 'Train-the-Trainer'],
    },
  ];
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Services | Digital Check Nigeria' });
  }
}

@Component({
  selector: 'app-digital-agriculture',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Digital Agriculture</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Priority practice</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Digital Agriculture</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          AI-enabled advisory, extension systems, farmer databases and climate-smart platforms.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container">
        <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          @for (item of items; track item; let i = $index) {
            <li class="dc-feature-item">
              <span class="dc-feature-index">{{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}</span>
              <span>{{ item }}</span>
            </li>
          }
        </ul>
        <a routerLink="/contact" class="dc-btn-dark mt-10">Discuss an agriculture project</a>
      </div>
    </section>
  `,
})
export class DigitalAgricultureComponent implements OnInit {
  private readonly seo = inject(SeoService);
  items = [
    'AI Enabled Advisory',
    'Digital Extension',
    'Farmer Databases & Profiling',
    'Market Linkages',
    'Climate Smart Agriculture',
    'Agriculture Dashboards',
  ];
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Digital Agriculture | Digital Check Nigeria' });
  }
}

@Component({
  selector: 'app-digital-economy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Digital Economy</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Enterprise focus</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Digital Economy &amp; Enterprise</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          Skills, MSME digitization, innovation ecosystems and enterprise development.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container">
        <ul class="grid gap-3 sm:grid-cols-2">
          @for (item of items; track item; let i = $index) {
            <li class="dc-feature-item">
              <span class="dc-feature-index">{{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}</span>
              <span>{{ item }}</span>
            </li>
          }
        </ul>
        <a routerLink="/contact" class="dc-btn-dark mt-10">Partner with us</a>
      </div>
    </section>
  `,
})
export class DigitalEconomyComponent implements OnInit {
  private readonly seo = inject(SeoService);
  items = [
    'Digital Skills & Workforce Development',
    'MSME Digitization',
    'Digital Financial Inclusion',
    'Innovation Ecosystem Development',
    'Entrepreneurship Support',
  ];
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Digital Economy | Digital Check Nigeria' });
  }
}

@Component({
  selector: 'app-partners-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Partners</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Relationships</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Partners &amp; Client Sectors</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          Government, development programmes, agribusiness networks, MSMEs and enterprise clients across Nigeria.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container">
        @if (partners().length) {
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            @for (p of partners(); track p.id) {
              <div class="dc-card p-6 sm:p-7">
                <span class="dc-chip">{{ p.category }}</span>
                <h3 class="mt-3 font-display text-2xl text-ink">{{ p.name }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted">{{ p.description }}</p>
              </div>
            }
          </div>
        } @else {
          <div class="dc-empty">
            <p class="font-medium text-ink">Partners coming soon.</p>
          </div>
        }
        <div class="mt-12">
          <div class="dc-panel-cta">
            <h2 class="font-display text-3xl">Looking to partner?</h2>
            <p class="mx-auto mt-3 max-w-xl text-white/85">
              We collaborate with institutions and consortia on delivery that is practical and measurable.
            </p>
            <a routerLink="/contact" class="dc-btn-primary mt-7">Start a conversation</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PartnersPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  readonly partners = signal<any[]>([]);
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Partners | Digital Check Nigeria' });
    this.api.get<any>('public/partners').subscribe({
      next: (r) => this.partners.set(r.data || []),
      error: () => this.partners.set([]),
    });
  }
}

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Media</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Storytelling</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Media Gallery</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          Photos, videos and programme galleries curated for stakeholder storytelling.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container">
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="dc-card p-6 sm:p-8">
            <span class="dc-chip">Insights</span>
            <h2 class="mt-3 font-display text-2xl text-ink">News &amp; field stories</h2>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Browse programme stories, announcements and delivery lessons from our teams.
            </p>
            <a routerLink="/news" class="dc-btn-dark mt-6">Latest insights</a>
          </div>
          <div class="dc-card p-6 sm:p-8">
            <span class="dc-chip">Portfolio</span>
            <h2 class="mt-3 font-display text-2xl text-ink">Project highlights</h2>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Explore delivery case studies spanning agriculture, platforms and capacity building.
            </p>
            <a routerLink="/projects" class="dc-btn-outline mt-6">View portfolio</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class MediaPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Media | Digital Check Nigeria' });
  }
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Contact</span>
        </nav>
        <span class="dc-kicker !text-glow mt-5">Get in touch</span>
        <h1 class="mt-3 font-display text-4xl text-white sm:text-5xl">Contact Digital Check Nigeria</h1>
        <p class="mt-4 max-w-2xl text-white/78">
          Project enquiries, partnerships, training programmes and managed ICT support.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container grid gap-8 lg:grid-cols-2">
        <form class="dc-card space-y-4 p-6 sm:p-8" (ngSubmit)="submit()">
          <h2 class="font-display text-2xl text-ink">Send a message</h2>
          <p class="text-sm text-muted">We typically respond within one business day.</p>
          <div class="dc-field">
            <label class="dc-label" for="c-name">Name</label>
            <input id="c-name" class="dc-input" [(ngModel)]="form.name" name="name" required autocomplete="name" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="c-email">Email</label>
            <input
              id="c-email"
              class="dc-input"
              type="email"
              [(ngModel)]="form.email"
              name="email"
              required
              autocomplete="email"
            />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="c-org">Organization</label>
            <input
              id="c-org"
              class="dc-input"
              [(ngModel)]="form.organization"
              name="organization"
              autocomplete="organization"
            />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="c-subject">Subject</label>
            <input id="c-subject" class="dc-input" [(ngModel)]="form.subject" name="subject" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="c-message">Message</label>
            <textarea
              id="c-message"
              class="dc-input min-h-32"
              rows="5"
              [(ngModel)]="form.message"
              name="message"
              required
            ></textarea>
          </div>
          <button class="dc-btn-dark w-full sm:w-auto" type="submit" [disabled]="sending">
            {{ sending ? 'Sending…' : 'Send message' }}
          </button>
          @if (message) {
            <p class="rounded-2xl bg-mist px-4 py-3 text-sm text-brand" role="status">{{ message }}</p>
          }
        </form>

        <div class="space-y-5">
          <div class="dc-card p-6 sm:p-8">
            <h2 class="font-display text-2xl text-ink">Office</h2>
            <div class="mt-5 space-y-4 text-sm">
              <p>
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Email</span>
                <a class="text-brand no-underline hover:underline" [href]="mailHref()">{{
                  settings()['contact_email'] || 'dafe@digitcheck.org'
                }}</a>
              </p>
              <p>
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Phone</span>
                <a class="text-brand no-underline hover:underline" [href]="telHref()">{{
                  settings()['contact_phone'] || '+234 908 455 9461'
                }}</a>
              </p>
              <p>
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Address</span
                >{{ settings()['contact_address'] || 'Maralago Lake City Resort, FCT, Abuja, Nigeria' }}
              </p>
              <p>
                <span class="block text-xs font-bold uppercase tracking-wider text-muted">Hours</span
                >{{ settings()['office_hours'] || 'Monday–Friday, 9:00–17:00 (WAT)' }}
              </p>
            </div>
          </div>
          <div class="dc-panel-cta !py-8 !text-left sm:!px-8">
            <h2 class="font-display text-2xl">Prefer to browse first?</h2>
            <p class="mt-3 max-w-md text-white/80">
              Review our services, portfolio case studies and programmes before you reach out.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a routerLink="/services" class="dc-btn-primary">Services</a>
              <a routerLink="/projects" class="dc-btn-ghost">Portfolio</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  readonly settings = signal<Record<string, unknown>>({});
  form = { name: '', email: '', organization: '', subject: '', message: '' };
  sending = false;
  message = '';

  ngOnInit(): void {
    this.seo.apply({
      meta_title: 'Contact | Digital Check Nigeria',
      meta_description: 'Contact Digital Check Nigeria in Abuja — dafe@digitcheck.org · +234 908 455 9461',
    });
    this.api.get<{ data: Record<string, unknown> }>('settings/public').subscribe({
      next: (res) => this.settings.set(res.data || {}),
      error: () => this.settings.set({}),
    });
  }

  submit(): void {
    this.sending = true;
    this.api.post<any>('public/contact', this.form).subscribe({
      next: () => {
        this.message = 'Thank you. We typically respond within one business day.';
        this.sending = false;
        this.form = { name: '', email: '', organization: '', subject: '', message: '' };
      },
      error: () => {
        this.message = 'Unable to send right now. Please email dafe@digitcheck.org.';
        this.sending = false;
      },
    });
  }

  mailHref(): string {
    return 'mailto:' + String(this.settings()['contact_email'] || 'dafe@digitcheck.org');
  }

  telHref(): string {
    const phone = String(this.settings()['contact_phone'] || '+2349084559461');
    return 'tel:' + phone.replace(/[^\d+]/g, '');
  }
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <nav class="dc-breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span>/</span><span class="is-current">Search</span>
        </nav>
        <h1 class="mt-5 font-display text-4xl text-white sm:text-5xl">Search</h1>
        <form class="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row" (ngSubmit)="search()" role="search">
          <label class="sr-only" for="global-search">Search query</label>
          <input
            id="global-search"
            class="dc-input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/50"
            [(ngModel)]="q"
            name="q"
            placeholder="Search news, projects, programmes…"
          />
          <button class="dc-btn-primary shrink-0" type="submit">Search</button>
        </form>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container max-w-3xl">
        @if (result()) {
          @for (group of groups; track group.key) {
            @if (result()![group.key]?.length) {
              <h2 class="mt-8 font-display text-2xl text-ink first:mt-0">{{ group.label }}</h2>
              <ul class="mt-3 divide-y divide-line overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-soft">
                @for (item of result()![group.key]; track item.id) {
                  <li>
                    <a
                      class="block px-4 py-3.5 text-sm font-medium text-ink no-underline transition hover:bg-sand"
                      [routerLink]="[group.path, item.slug]"
                      >{{ item.title || item.name }}</a
                    >
                  </li>
                }
              </ul>
            }
          }
          @if (total() === 0) {
            <div class="dc-empty">
              <p class="font-medium text-ink">No results for “{{ q }}”</p>
              <p class="mt-1 text-sm text-muted">Try a broader term, or browse services and portfolio.</p>
              <div class="mt-5 flex flex-wrap justify-center gap-3">
                <a routerLink="/services" class="dc-btn-outline">Services</a>
                <a routerLink="/projects" class="dc-btn-dark">Portfolio</a>
              </div>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class SearchPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '').get('q') || '';
  readonly result = signal<any>(null);
  groups = [
    { key: 'pages', label: 'Pages', path: '/p' },
    { key: 'news', label: 'News', path: '/news' },
    { key: 'blogs', label: 'Articles', path: '/news' },
    { key: 'projects', label: 'Projects', path: '/projects' },
    { key: 'programmes', label: 'Programmes', path: '/programmes' },
    { key: 'publications', label: 'Publications', path: '/publications' },
    { key: 'events', label: 'Events', path: '/events' },
  ];
  ngOnInit(): void {
    this.seo.apply({ meta_title: 'Search | Digital Check Nigeria', robots: 'noindex' });
    if (this.q) this.search();
  }
  total(): number {
    const r = this.result();
    if (!r) return 0;
    return this.groups.reduce((sum, g) => sum + (r[g.key]?.length || 0), 0);
  }
  search(): void {
    if (!this.q.trim()) return;
    this.api.get<any>('public/search', { q: this.q }).subscribe({
      next: (res) => this.result.set(res.data),
      error: () => this.result.set({}),
    });
  }
}
