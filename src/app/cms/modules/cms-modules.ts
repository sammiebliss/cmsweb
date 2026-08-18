import { Component, OnInit, inject, signal } from '@angular/core';
import { CmsResourceComponent } from '../shared/cms-resource';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-cms-pages',
  standalone: true,
  imports: [CmsResourceComponent],
  template: `
    <app-cms-resource
      title="Pages"
      endpoint="pages"
      [publishable]="true"
      [columns]="[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status' }
      ]"
      [fields]="[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'template', label: 'Template' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'scheduled', 'archived'] }
      ]"
    />
  `,
})
export class CmsPagesComponent {}

@Component({ selector: 'app-cms-news', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="News" subtitle="Press releases, announcements and insights" endpoint="news" [publishable]="true"
    [columns]="[{key:'title',label:'Title'},{key:'type',label:'Type'},{key:'status',label:'Status'},{key:'is_featured',label:'Featured'}]"
    [fields]="[
      {key:'title',label:'Title',required:true},
      {key:'slug',label:'Slug'},
      {key:'type',label:'Type',type:'select',options:['news','press_release','announcement','success_story','article']},
      {key:'excerpt',label:'Excerpt',type:'textarea'},
      {key:'body',label:'Body',type:'textarea'},
      {key:'featured_image',label:'Featured image URL'},
      {key:'is_featured',label:'Featured',type:'checkbox',placeholder:'Show as featured'},
      {key:'status',label:'Status',type:'select',options:['draft','published','scheduled','archived']}
    ]" />` })
export class CmsNewsComponent {}

@Component({ selector: 'app-cms-blog', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Blog" subtitle="Long-form articles and thought leadership" endpoint="blogs" [publishable]="true"
    [columns]="[{key:'title',label:'Title'},{key:'status',label:'Status'},{key:'is_featured',label:'Featured'}]"
    [fields]="[
      {key:'title',label:'Title',required:true},
      {key:'slug',label:'Slug'},
      {key:'excerpt',label:'Excerpt',type:'textarea'},
      {key:'body',label:'Body',type:'textarea'},
      {key:'featured_image',label:'Featured image URL'},
      {key:'is_featured',label:'Featured',type:'checkbox'},
      {key:'status',label:'Status',type:'select',options:['draft','published','scheduled','archived']}
    ]" />` })
export class CmsBlogComponent {}

@Component({ selector: 'app-cms-projects', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Projects" endpoint="projects" [publishable]="true"
    [columns]="[{key:'name',label:'Name'},{key:'client',label:'Client'},{key:'project_status',label:'Delivery'},{key:'status',label:'Status'}]"
    [fields]="[
      {key:'name',label:'Name',required:true},
      {key:'slug',label:'Slug'},
      {key:'client',label:'Client'},
      {key:'sector',label:'Sector'},
      {key:'description',label:'Description',type:'textarea'},
      {key:'challenge',label:'Challenge',type:'textarea'},
      {key:'solution',label:'Solution',type:'textarea'},
      {key:'objectives',label:'Objectives',type:'textarea'},
      {key:'deliverables',label:'Deliverables',type:'textarea'},
      {key:'location',label:'Location'},
      {key:'featured_image',label:'Featured image URL'},
      {key:'project_status',label:'Project status',type:'select',options:['ongoing','completed']},
      {key:'is_featured',label:'Featured',type:'checkbox'},
      {key:'status',label:'Publish status',type:'select',options:['draft','published','scheduled','archived']}
    ]" />` })
export class CmsProjectsComponent {}

@Component({ selector: 'app-cms-programmes', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Programmes" endpoint="programmes" [publishable]="true"
    [columns]="[{key:'name',label:'Name'},{key:'status',label:'Status'}]"
    [fields]="[
      {key:'name',label:'Name'},
      {key:'slug',label:'Slug'},
      {key:'funder',label:'Funder'},
      {key:'geography',label:'Geography'},
      {key:'description',label:'Description',type:'textarea'},
      {key:'beneficiaries',label:'Beneficiaries',type:'textarea'},
      {key:'results',label:'Results',type:'textarea'},
      {key:'featured_image',label:'Featured image URL'},
      {key:'is_featured',label:'Featured',type:'checkbox'},
      {key:'status',label:'Status',type:'select',options:['draft','published']}
    ]" />` })
export class CmsProgrammesComponent {}

@Component({ selector: 'app-cms-events', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Events" endpoint="events" [publishable]="true"
    [columns]="[{key:'title',label:'Title'},{key:'location',label:'Location'},{key:'status',label:'Status'}]"
    [fields]="[{key:'title',label:'Title'},{key:'slug',label:'Slug'},{key:'summary',label:'Summary',type:'textarea'},{key:'description',label:'Description',type:'textarea'},{key:'location',label:'Location'},{key:'starts_at',label:'Starts at',type:'datetime-local'},{key:'ends_at',label:'Ends at',type:'datetime-local'},{key:'status',label:'Status',type:'select',options:['draft','published']}]" />` })
export class CmsEventsComponent {}

@Component({ selector: 'app-cms-publications', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Publications" endpoint="publications" [publishable]="true"
    [columns]="[{key:'title',label:'Title'},{key:'type',label:'Type'},{key:'download_count',label:'Downloads'},{key:'status',label:'Status'}]"
    [fields]="[{key:'title',label:'Title'},{key:'slug',label:'Slug'},{key:'type',label:'Type'},{key:'summary',label:'Summary',type:'textarea'},{key:'file_path',label:'File path'},{key:'status',label:'Status',type:'select',options:['draft','published']}]" />` })
export class CmsPublicationsComponent {}

@Component({ selector: 'app-cms-partners', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Partners" endpoint="partners"
    [columns]="[{key:'name',label:'Name'},{key:'category',label:'Category'},{key:'status',label:'Status'}]"
    [fields]="[{key:'name',label:'Name'},{key:'slug',label:'Slug'},{key:'category',label:'Category',type:'select',options:['government','development','technology','financial','strategic']},{key:'website',label:'Website'},{key:'description',label:'Description',type:'textarea'},{key:'status',label:'Status',type:'select',options:['published','draft']}]" />` })
export class CmsPartnersComponent {}

@Component({ selector: 'app-cms-testimonials', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Testimonials" endpoint="testimonials"
    [columns]="[{key:'client_name',label:'Client'},{key:'type',label:'Type'},{key:'status',label:'Status'}]"
    [fields]="[{key:'client_name',label:'Client name'},{key:'client_role',label:'Role'},{key:'client_organization',label:'Organization'},{key:'content',label:'Content',type:'textarea'},{key:'type',label:'Type',type:'select',options:['written','video']},{key:'status',label:'Status',type:'select',options:['draft','published']}]" />` })
export class CmsTestimonialsComponent {}

@Component({ selector: 'app-cms-careers', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Careers" endpoint="careers" [publishable]="true"
    [columns]="[{key:'title',label:'Title'},{key:'location',label:'Location'},{key:'status',label:'Status'}]"
    [fields]="[{key:'title',label:'Title',required:true},{key:'slug',label:'Slug'},{key:'type',label:'Type',type:'select',options:['full_time','part_time','contract','graduate','internship']},{key:'location',label:'Location'},{key:'department',label:'Department'},{key:'summary',label:'Summary',type:'textarea'},{key:'description',label:'Description',type:'textarea'},{key:'requirements',label:'Requirements',type:'textarea'},{key:'status',label:'Status',type:'select',options:['draft','published','scheduled','archived']}]" />` })
export class CmsCareersComponent {}

@Component({ selector: 'app-cms-applications', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Job Applications" subtitle="Review and progress candidate applications" endpoint="applications"
    [canDelete]="false"
    [columns]="[{key:'name',label:'Candidate'},{key:'email',label:'Email'},{key:'status',label:'Status'},{key:'created_at',label:'Submitted'}]"
    [fields]="[{key:'status',label:'Status',type:'select',options:['new','shortlisted','interview','offer','hired','rejected']},{key:'notes',label:'Notes',type:'textarea'},{key:'interview_at',label:'Interview at',type:'datetime-local'}]" />` })
export class CmsApplicationsComponent {}

@Component({ selector: 'app-cms-leads', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Leads" subtitle="Pipeline from contact, partnerships and service requests" endpoint="leads"
    [columns]="[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'source',label:'Source'},{key:'status',label:'Status'},{key:'subject',label:'Subject'}]"
    [fields]="[{key:'status',label:'Status',type:'select',options:['new','assigned','contacted','qualified','proposal_sent','won','lost']}]" />` })
export class CmsLeadsComponent {}

@Component({ selector: 'app-cms-users', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Users" endpoint="users"
    [columns]="[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'is_active',label:'Active'}]"
    [fields]="[{key:'name',label:'Name',required:true},{key:'email',label:'Email',required:true},{key:'password',label:'Password',type:'password'},{key:'is_active',label:'Active',type:'checkbox',placeholder:'User can sign in'}]" />` })
export class CmsUsersComponent {}

@Component({ selector: 'app-cms-menus', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Menus" endpoint="menus"
    [columns]="[{key:'name',label:'Name'},{key:'location',label:'Location'}]"
    [fields]="[{key:'name',label:'Name'},{key:'location',label:'Location'}]" />` })
export class CmsMenusComponent {}

@Component({ selector: 'app-cms-forms', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Forms" endpoint="forms"
    [columns]="[{key:'name',label:'Name'},{key:'slug',label:'Slug'}]"
    [fields]="[{key:'name',label:'Name'},{key:'slug',label:'Slug'},{key:'description',label:'Description',type:'textarea'}]"
    [createPayload]="payload" />` })
export class CmsFormsComponent {
  payload = (form: any) => ({
    ...form,
    schema: form.schema || { fields: [{ key: 'name', type: 'text', label: 'Name', required: true }] },
  });
}

@Component({ selector: 'app-cms-seo', standalone: true, imports: [CmsResourceComponent], template: `
  <app-cms-resource title="Redirects" endpoint="redirects"
    [columns]="[{key:'from_path',label:'From'},{key:'to_path',label:'To'},{key:'status_code',label:'Code'}]"
    [fields]="[{key:'from_path',label:'From path'},{key:'to_path',label:'To path'},{key:'status_code',label:'Status code'}]" />` })
export class CmsSeoComponent {}

@Component({
  selector: 'app-cms-media',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Media Library</h1>
        <p class="cms-page-sub">Upload and manage files used across content and brand assets.</p>
      </div>
      <label class="cms-btn cms-btn-primary" style="cursor: pointer">
        <i class="pi pi-upload" aria-hidden="true"></i>
        Upload file
        <input type="file" hidden (change)="upload($event)" />
      </label>
    </div>

    @if (message()) {
      <div class="cms-alert" [class.cms-alert-success]="!error()" [class.cms-alert-error]="error()">{{ message() }}</div>
    }

    <div class="media-grid">
      @for (item of items(); track item.id) {
        <div class="cms-panel media-card">
          <div class="media-icon" aria-hidden="true"><i class="pi pi-file"></i></div>
          <div class="media-name" [title]="item.name">{{ item.name }}</div>
          <div class="media-meta">{{ item.mime_type || 'file' }}</div>
          <div class="media-actions">
            @if (item.url || item.path) {
              <a class="cms-btn cms-btn-ghost cms-btn-sm" [href]="item.url || item.path" target="_blank" rel="noopener">Open</a>
            }
            <button class="cms-btn cms-btn-danger cms-btn-sm" type="button" (click)="remove(item)">Delete</button>
          </div>
        </div>
      } @empty {
        <div class="cms-panel cms-empty" style="grid-column: 1 / -1">
          <strong>No media uploaded yet</strong>
          <span>Upload images or documents to reuse across pages and portfolio items.</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .media-grid {
        display: grid;
        gap: 0.85rem;
        grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
      }
      .media-card {
        display: flex;
        flex-direction: column;
        min-height: 10rem;
      }
      .media-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.75rem;
        display: grid;
        place-items: center;
        background: var(--cms-mist);
        color: var(--cms-brand);
        margin-bottom: 0.65rem;
      }
      .media-name {
        font-weight: 650;
        font-size: 0.88rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .media-meta {
        color: var(--cms-muted);
        font-size: 0.76rem;
        margin-top: 0.2rem;
        margin-bottom: auto;
      }
      .media-actions {
        display: flex;
        gap: 0.35rem;
        margin-top: 0.75rem;
      }
    `,
  ],
})
export class CmsMediaComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly items = signal<any[]>([]);
  readonly message = signal('');
  readonly error = signal(false);

  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.api.get<any>('media').subscribe({
      next: (r) => this.items.set(r.data || []),
      error: () => this.items.set([]),
    });
  }
  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    this.api.upload('media', fd).subscribe({
      next: () => {
        this.error.set(false);
        this.message.set('Upload complete.');
        this.load();
        input.value = '';
      },
      error: () => {
        this.error.set(true);
        this.message.set('Upload failed.');
      },
    });
  }
  remove(item: any): void {
    if (!confirm(`Delete “${item.name}”?`)) return;
    this.api.delete(`media/${item.id}`).subscribe({
      next: () => {
        this.error.set(false);
        this.message.set('Media deleted.');
        this.load();
      },
      error: () => {
        this.error.set(true);
        this.message.set('Delete failed.');
      },
    });
  }
}

@Component({
  selector: 'app-cms-newsletter',
  standalone: true,
  imports: [CmsResourceComponent],
  template: `
    <app-cms-resource title="Campaigns" endpoint="newsletter/campaigns"
      [columns]="[{key:'name',label:'Name'},{key:'subject',label:'Subject'},{key:'status',label:'Status'},{key:'sent_count',label:'Sent'}]"
      [fields]="[{key:'name',label:'Name'},{key:'subject',label:'Subject'},{key:'body',label:'Body',type:'textarea'}]" />
  `,
})
export class CmsNewsletterComponent {}

@Component({
  selector: 'app-cms-roles',
  standalone: true,
  imports: [CmsResourceComponent],
  template: `
    <app-cms-resource title="Roles" endpoint="roles"
      [columns]="[{key:'name',label:'Name'}]"
      [fields]="[{key:'name',label:'Name'}]"
      [canDelete]="true" />
  `,
})
export class CmsRolesComponent {}

@Component({
  selector: 'app-cms-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Brand &amp; Settings</h1>
        <p class="cms-page-sub">Public website values controlled from CMS. Changes apply immediately on the site.</p>
      </div>
      <button class="cms-btn cms-btn-primary" type="button" (click)="save()" [disabled]="saving">
        {{ saving ? 'Saving…' : 'Save settings' }}
      </button>
    </div>

    @if (msg) {
      <div class="cms-alert" [class.cms-alert-success]="!err" [class.cms-alert-error]="err">{{ msg }}</div>
    }

    <div class="settings-grid">
      <div class="cms-panel">
        <h2 class="section-title">Brand</h2>
        <div class="cms-field"><label class="cms-label">Site name</label><input class="cms-input" [(ngModel)]="form.site_name" name="site_name" /></div>
        <div class="cms-field"><label class="cms-label">Tagline</label><input class="cms-input" [(ngModel)]="form.site_tagline" name="site_tagline" /></div>
        <div class="cms-field"><label class="cms-label">Logo URL</label><input class="cms-input" [(ngModel)]="form.site_logo" name="site_logo" placeholder="https://…" /></div>
        <div class="cms-field"><label class="cms-label">Brand cover image URL</label><input class="cms-input" [(ngModel)]="form.brand_cover_image" name="brand_cover_image" placeholder="Hero fallback image" /></div>
        <div class="cms-field"><label class="cms-label">Header CTA label</label><input class="cms-input" [(ngModel)]="form.header_cta_label" name="header_cta_label" /></div>
        <div class="cms-field"><label class="cms-label">Header CTA URL</label><input class="cms-input" [(ngModel)]="form.header_cta_url" name="header_cta_url" /></div>
        <div class="cms-field"><label class="cms-label">Footer about</label><textarea class="cms-textarea" rows="3" [(ngModel)]="form.footer_about" name="footer_about"></textarea></div>
        <div class="cms-field"><label class="cms-label">Footer text</label><input class="cms-input" [(ngModel)]="form.footer_text" name="footer_text" /></div>
      </div>

      <div class="cms-panel">
        <h2 class="section-title">Contact</h2>
        <div class="cms-field"><label class="cms-label">Contact email</label><input class="cms-input" [(ngModel)]="form.contact_email" name="contact_email" /></div>
        <div class="cms-field"><label class="cms-label">Contact phone</label><input class="cms-input" [(ngModel)]="form.contact_phone" name="contact_phone" /></div>
        <div class="cms-field"><label class="cms-label">Address</label><input class="cms-input" [(ngModel)]="form.contact_address" name="contact_address" /></div>
        <div class="cms-field"><label class="cms-label">Office hours</label><input class="cms-input" [(ngModel)]="form.office_hours" name="office_hours" /></div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-grid {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 960px) {
        .settings-grid {
          grid-template-columns: 1.2fr 0.8fr;
          align-items: start;
        }
      }
      .section-title {
        margin: 0 0 1rem;
        font-family: var(--cms-display);
        font-size: 1.15rem;
        font-weight: 500;
      }
    `,
  ],
})
export class CmsSettingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  form: any = {};
  msg = '';
  err = false;
  saving = false;
  ngOnInit(): void {
    this.api.get<any>('settings').subscribe({ next: (r) => (this.form = { ...(r.data || {}) }) });
  }
  save(): void {
    this.saving = true;
    const settings = Object.entries(this.form).map(([key, value]) => ({ key, value }));
    this.api.put('settings', { settings }).subscribe({
      next: () => {
        this.saving = false;
        this.err = false;
        this.msg = 'Saved. Public site will reflect changes immediately.';
      },
      error: () => {
        this.saving = false;
        this.err = true;
        this.msg = 'Unable to save settings.';
      },
    });
  }
}

@Component({
  selector: 'app-cms-analytics',
  standalone: true,
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Analytics</h1>
        <p class="cms-page-sub">Traffic and search behaviour across the public website.</p>
      </div>
    </div>

    <div class="cms-stat-grid" style="margin-bottom: 1rem">
      <div class="cms-stat">
        <div class="value">{{ summary()?.page_views || 0 }}</div>
        <div class="label">Page views (30d)</div>
      </div>
      <div class="cms-stat">
        <div class="value">{{ summary()?.unique_sessions || 0 }}</div>
        <div class="label">Sessions</div>
      </div>
    </div>

    <div class="cms-panel">
      <h2 class="cms-page-title" style="font-size: 1.2rem; margin-bottom: 0.5rem">Top searches</h2>
      @for (s of summary()?.top_searches || []; track s.query) {
        <div class="cms-list-row">
          <span>{{ s.query }}</span>
          <strong>{{ s.hits }}</strong>
        </div>
      } @empty {
        <div class="cms-empty" style="padding: 1.25rem 0">
          <strong>No search data yet</strong>
          <span>Queries from the public search page will appear here.</span>
        </div>
      }
    </div>
  `,
})
export class CmsAnalyticsComponent implements OnInit {
  private readonly api = inject(ApiService);
  summary = signal<any>(null);
  ngOnInit(): void {
    this.api.get<any>('analytics/summary').subscribe({
      next: (r) => this.summary.set(r.data),
      error: () => this.summary.set({}),
    });
  }
}

@Component({
  selector: 'app-cms-audit',
  standalone: true,
  imports: [CmsResourceComponent],
  template: `
    <app-cms-resource title="Audit Logs" endpoint="audit-logs" [readOnly]="true"
      [columns]="[{key:'event',label:'Event'},{key:'ip_address',label:'IP'},{key:'created_at',label:'When'}]"
      [fields]="[]" />
  `,
})
export class CmsAuditComponent {}
