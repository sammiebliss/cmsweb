import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api/api.service';

interface SectionForm {
  type: string;
  key: string;
  title: string;
  contentJson: string;
  sort_order: number;
  is_active: boolean;
}

@Component({
  selector: 'app-cms-pages-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Pages</h1>
        <p class="cms-page-sub">Manage website pages, sections and SEO metadata.</p>
      </div>
      <button class="cms-btn cms-btn-primary" type="button" (click)="createNew()">
        <i class="pi pi-plus" aria-hidden="true"></i>
        New page
      </button>
    </div>

    @if (message()) {
      <div class="cms-alert" [class.cms-alert-success]="!error()" [class.cms-alert-error]="error()" role="status">
        {{ message() }}
      </div>
    }

    <div class="pages-layout">
      <aside class="cms-panel list-panel">
        <input
          class="cms-search"
          style="width: 100%; margin-bottom: 0.85rem"
          placeholder="Search pages…"
          [(ngModel)]="q"
          (keyup.enter)="load()"
          name="pageSearch"
        />
        <div class="page-list">
          @for (page of pages(); track page.id) {
            <button
              class="page-item"
              type="button"
              [class.active]="selected()?.id === page.id"
              (click)="select(page.id)"
            >
              <span class="page-item-top">
                <strong>{{ page.title }}</strong>
                <span class="cms-badge" [class]="statusClass(page.status)">{{ page.status }}</span>
              </span>
              <small>/{{ page.slug }}</small>
            </button>
          } @empty {
            <div class="cms-empty" style="padding: 1.5rem 0.25rem">
              <strong>No pages yet</strong>
              <span>Create your first page.</span>
            </div>
          }
        </div>
      </aside>

      <section class="cms-panel editor-panel">
        @if (selected() || creating()) {
          <div class="editor-grid">
            <div class="cms-field">
              <label class="cms-label">Title</label>
              <input class="cms-input" [(ngModel)]="form.title" name="title" />
            </div>
            <div class="cms-field">
              <label class="cms-label">Slug</label>
              <input class="cms-input" [(ngModel)]="form.slug" name="slug" />
            </div>
            <div class="cms-field">
              <label class="cms-label">Template</label>
              <select class="cms-select" [(ngModel)]="form.template" name="template">
                <option value="default">Default</option>
                <option value="home">Home</option>
                <option value="landing">Landing</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <div class="cms-field">
              <label class="cms-label">Status</label>
              <select class="cms-select" [(ngModel)]="form.status" name="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div class="cms-field">
              <label class="cms-label">Scheduled at</label>
              <input class="cms-input" type="datetime-local" [(ngModel)]="form.scheduled_at" name="scheduled_at" />
            </div>
          </div>

          <div class="section-divider">
            <h2>SEO</h2>
          </div>
          <div class="editor-grid">
            <div class="cms-field">
              <label class="cms-label">Meta title</label>
              <input class="cms-input" [(ngModel)]="seo.meta_title" name="meta_title" />
            </div>
            <div class="cms-field">
              <label class="cms-label">Canonical URL</label>
              <input class="cms-input" [(ngModel)]="seo.canonical_url" name="canonical_url" />
            </div>
            <div class="cms-field full">
              <label class="cms-label">Meta description</label>
              <textarea class="cms-textarea" rows="2" [(ngModel)]="seo.meta_description" name="meta_description"></textarea>
            </div>
          </div>

          <div class="section-divider">
            <h2>Sections</h2>
            <button class="cms-btn cms-btn-ghost cms-btn-sm" type="button" (click)="addSection()">
              <i class="pi pi-plus" aria-hidden="true"></i>
              Add section
            </button>
          </div>

          @for (section of sections; track $index; let i = $index) {
            <div class="section-card">
              <div class="editor-grid compact">
                <div class="cms-field">
                  <label class="cms-label">Type</label>
                  <select class="cms-select" [(ngModel)]="section.type" [name]="'type' + i">
                    @for (t of sectionTypes; track t) {
                      <option [value]="t">{{ t }}</option>
                    }
                  </select>
                </div>
                <div class="cms-field">
                  <label class="cms-label">Key</label>
                  <input class="cms-input" [(ngModel)]="section.key" [name]="'key' + i" />
                </div>
                <div class="cms-field">
                  <label class="cms-label">Title</label>
                  <input class="cms-input" [(ngModel)]="section.title" [name]="'stitle' + i" />
                </div>
                <div class="cms-field" style="display:flex;align-items:flex-end">
                  <button class="cms-btn cms-btn-danger cms-btn-sm" style="width:100%" type="button" (click)="removeSection(i)">
                    Remove
                  </button>
                </div>
                <div class="cms-field full">
                  <label class="cms-label">Content (JSON)</label>
                  <textarea
                    class="cms-textarea mono"
                    rows="5"
                    [(ngModel)]="section.contentJson"
                    [name]="'content' + i"
                  ></textarea>
                </div>
              </div>
            </div>
          }

          <div class="cms-toolbar" style="margin-top: 1rem">
            <button class="cms-btn cms-btn-primary" type="button" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving…' : 'Save page' }}
            </button>
            @if (selected()?.id) {
              <button class="cms-btn cms-btn-brand" type="button" (click)="publish()">Publish</button>
              <button class="cms-btn cms-btn-ghost" type="button" (click)="clone()">Clone</button>
              <a
                class="cms-btn cms-btn-ghost"
                [routerLink]="['/', form.slug === 'home' ? '' : form.slug]"
                target="_blank"
                >Preview</a
              >
            }
          </div>
        } @else {
          <div class="cms-empty">
            <strong>Select a page</strong>
            <span>Choose a page from the list, or create a new one to start editing.</span>
          </div>
        }
      </section>
    </div>
  `,
  styles: [
    `
      .pages-layout {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 992px) {
        .pages-layout {
          grid-template-columns: 18.5rem minmax(0, 1fr);
          align-items: start;
        }
      }
      .list-panel {
        position: sticky;
        top: 5rem;
      }
      .page-list {
        max-height: min(70vh, 42rem);
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }
      .page-item {
        width: 100%;
        text-align: left;
        border: 1px solid transparent;
        background: var(--cms-sand);
        border-radius: 0.8rem;
        padding: 0.75rem 0.8rem;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
      }
      .page-item:hover {
        border-color: color-mix(in srgb, var(--cms-brand) 25%, var(--cms-line));
      }
      .page-item.active {
        border-color: color-mix(in srgb, var(--cms-glow) 55%, var(--cms-brand));
        background: #eefaf4;
        box-shadow: inset 0 0 0 1px rgb(168 232 106 / 0.35);
      }
      .page-item-top {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        align-items: flex-start;
      }
      .page-item strong {
        font-size: 0.92rem;
      }
      .page-item small {
        display: block;
        margin-top: 0.3rem;
        color: var(--cms-muted);
      }
      .editor-grid {
        display: grid;
        gap: 0.75rem;
      }
      @media (min-width: 768px) {
        .editor-grid {
          grid-template-columns: 1fr 1fr;
        }
        .editor-grid.compact {
          grid-template-columns: 1fr 1fr 1.2fr 0.8fr;
        }
        .editor-grid .full {
          grid-column: 1 / -1;
        }
      }
      .section-divider {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin: 1.25rem 0 0.85rem;
        padding-top: 1rem;
        border-top: 1px solid var(--cms-line);
      }
      .section-divider h2 {
        margin: 0;
        font-family: var(--cms-display);
        font-size: 1.15rem;
        font-weight: 500;
      }
      .section-card {
        border: 1px solid var(--cms-line);
        border-radius: 0.9rem;
        padding: 0.9rem;
        background: color-mix(in srgb, var(--cms-sand) 70%, white);
        margin-bottom: 0.75rem;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.82rem;
      }
    `,
  ],
})
export class CmsPagesAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly pages = signal<any[]>([]);
  readonly selected = signal<any>(null);
  readonly creating = signal(false);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal(false);
  q = '';
  form: any = { title: '', slug: '', template: 'default', status: 'draft', scheduled_at: '' };
  seo: any = { meta_title: '', meta_description: '', canonical_url: '' };
  sections: SectionForm[] = [];
  sectionTypes = [
    'hero',
    'stats',
    'content',
    'cta',
    'services_overview',
    'services_grid',
    'feature_list',
    'values',
    'methodology',
    'faq',
    'gallery',
  ];

  ngOnInit(): void {
    this.load();
  }

  statusClass(status: string): string {
    if (status === 'published') return 'cms-badge-published';
    if (status === 'draft') return 'cms-badge-draft';
    if (status === 'scheduled') return 'cms-badge-scheduled';
    if (status === 'archived') return 'cms-badge-archived';
    return 'cms-badge-default';
  }

  load(): void {
    this.api.get<any>('pages', { q: this.q || undefined, per_page: 100 }).subscribe({
      next: (res) => this.pages.set(res.data || []),
      error: () => this.pages.set([]),
    });
  }

  createNew(): void {
    this.creating.set(true);
    this.selected.set(null);
    this.form = { title: '', slug: '', template: 'default', status: 'draft', scheduled_at: '' };
    this.seo = { meta_title: '', meta_description: '', canonical_url: '' };
    this.sections = [
      {
        type: 'content',
        key: 'main',
        title: 'Main content',
        contentJson: JSON.stringify({ html: '<p>Write your content here…</p>' }, null, 2),
        sort_order: 0,
        is_active: true,
      },
    ];
  }

  select(id: number): void {
    this.creating.set(false);
    this.api.get<any>(`pages/${id}`).subscribe({
      next: (res) => {
        const page = res.data;
        this.selected.set(page);
        this.form = {
          title: page.title,
          slug: page.slug,
          template: page.template || 'default',
          status: page.status,
          scheduled_at: page.scheduled_at ? String(page.scheduled_at).slice(0, 16) : '',
        };
        this.seo = {
          meta_title: page.seo_meta?.meta_title || '',
          meta_description: page.seo_meta?.meta_description || '',
          canonical_url: page.seo_meta?.canonical_url || '',
        };
        this.sections = (page.sections || []).map((s: any, i: number) => ({
          type: s.type,
          key: s.key || `section-${i}`,
          title: s.title || '',
          contentJson: JSON.stringify(s.content || {}, null, 2),
          sort_order: s.sort_order ?? i,
          is_active: s.is_active !== false,
        }));
      },
    });
  }

  addSection(): void {
    this.sections.push({
      type: 'content',
      key: `section-${this.sections.length + 1}`,
      title: '',
      contentJson: '{\n  "html": ""\n}',
      sort_order: this.sections.length,
      is_active: true,
    });
  }

  removeSection(index: number): void {
    this.sections.splice(index, 1);
  }

  save(): void {
    let sectionsPayload: any[] = [];
    try {
      sectionsPayload = this.sections.map((s, i) => ({
        type: s.type,
        key: s.key,
        title: s.title,
        content: JSON.parse(s.contentJson || '{}'),
        sort_order: i,
        is_active: s.is_active,
      }));
    } catch {
      this.error.set(true);
      this.message.set('Section content must be valid JSON.');
      return;
    }

    const payload = {
      ...this.form,
      scheduled_at: this.form.scheduled_at || null,
      sections: sectionsPayload,
      seo: this.seo,
    };

    this.saving.set(true);
    const id = this.selected()?.id;
    const req = id ? this.api.put(`pages/${id}`, payload) : this.api.post('pages', payload);
    req.subscribe({
      next: (res: any) => {
        this.saving.set(false);
        this.error.set(false);
        this.message.set('Page saved.');
        this.load();
        const page = res.data;
        this.creating.set(false);
        this.selected.set(page);
        this.select(page.id);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(true);
        this.message.set(err?.error?.message || 'Unable to save page.');
      },
    });
  }

  publish(): void {
    const id = this.selected()?.id;
    if (!id) return;
    this.api.post(`pages/${id}/publish`).subscribe({
      next: () => {
        this.message.set('Page published.');
        this.error.set(false);
        this.select(id);
        this.load();
      },
    });
  }

  clone(): void {
    const id = this.selected()?.id;
    if (!id) return;
    this.api.post(`pages/${id}/clone`).subscribe({
      next: (res: any) => {
        this.message.set('Page cloned.');
        this.error.set(false);
        this.load();
        this.select(res.data.id);
      },
    });
  }
}
