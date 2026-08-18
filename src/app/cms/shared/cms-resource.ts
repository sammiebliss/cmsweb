import { Component, HostListener, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface ResourceColumn {
  key: string;
  label: string;
}

export interface ResourceField {
  key: string;
  label: string;
  type?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

@Component({
  selector: 'app-cms-resource',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">{{ title }}</h1>
        <p class="cms-page-sub" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <button class="cms-btn cms-btn-primary" type="button" (click)="openCreate()" *ngIf="!readOnly">
        <i class="pi pi-plus" aria-hidden="true"></i>
        New {{ title }}
      </button>
    </div>

    @if (banner(); as b) {
      <div class="cms-alert" [class.cms-alert-success]="b.type === 'success'" [class.cms-alert-error]="b.type === 'error'" role="status">
        <i class="pi" [class.pi-check-circle]="b.type === 'success'" [class.pi-exclamation-circle]="b.type === 'error'" aria-hidden="true"></i>
        <span>{{ b.text }}</span>
      </div>
    }

    <div class="cms-panel" style="margin-bottom: 1rem">
      <div class="cms-toolbar">
        <input
          class="cms-search"
          [placeholder]="'Search ' + title.toLowerCase() + '…'"
          [(ngModel)]="q"
          (keyup.enter)="load()"
          name="resourceSearch"
        />
        <button class="cms-btn cms-btn-ghost" type="button" (click)="load()" [disabled]="loading()">
          <i class="pi pi-search" aria-hidden="true"></i>
          Search
        </button>
        <button class="cms-btn cms-btn-ghost" type="button" (click)="clearSearch()" *ngIf="q" [disabled]="loading()">Clear</button>
      </div>
    </div>

    <div class="cms-panel" style="padding: 0; overflow: hidden">
      @if (loading()) {
        <div style="padding: 1.25rem; display: grid; gap: 0.65rem">
          <div class="cms-skeleton" style="height: 2.4rem"></div>
          <div class="cms-skeleton" style="height: 2.4rem"></div>
          <div class="cms-skeleton" style="height: 2.4rem"></div>
        </div>
      } @else {
        <div class="cms-table-wrap">
          <table class="cms-table">
            <thead>
              <tr>
                @for (col of columns; track col.key) {
                  <th>{{ col.label }}</th>
                }
                <th style="text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (row of items(); track row.id) {
                <tr>
                  @for (col of columns; track col.key) {
                    <td>
                      @if (col.key === 'status' || col.key === 'project_status') {
                        <span class="cms-badge" [class]="statusClass(row[col.key])">{{ row[col.key] || '—' }}</span>
                      } @else if (col.key === 'is_featured' || col.key === 'is_active') {
                        <span class="cms-badge" [class]="row[col.key] ? 'cms-badge-published' : 'cms-badge-draft'">
                          {{ row[col.key] ? 'Yes' : 'No' }}
                        </span>
                      } @else {
                        {{ displayValue(row, col.key) }}
                      }
                    </td>
                  }
                  <td class="actions">
                    <button class="cms-btn cms-btn-ghost cms-btn-sm" type="button" (click)="edit(row)" *ngIf="!readOnly">Edit</button>
                    <button
                      class="cms-btn cms-btn-primary cms-btn-sm"
                      type="button"
                      (click)="publish(row)"
                      *ngIf="publishable && row.status !== 'published'"
                    >
                      Publish
                    </button>
                    <button
                      class="cms-btn cms-btn-danger cms-btn-sm"
                      type="button"
                      (click)="remove(row)"
                      *ngIf="!readOnly && canDelete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="columns.length + 1">
                    <div class="cms-empty">
                      <strong>No records found</strong>
                      <span>{{ q ? 'Try a different search term.' : 'Create your first item to get started.' }}</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div style="padding: 0.75rem 1rem; border-top: 1px solid var(--cms-line); color: var(--cms-muted); font-size: 0.82rem">
          {{ items().length }} record{{ items().length === 1 ? '' : 's' }}
        </div>
      }
    </div>

    @if (showForm()) {
      <div class="cms-drawer" role="dialog" aria-modal="true" [attr.aria-label]="(editingId() ? 'Edit' : 'Create') + ' ' + title">
        <button type="button" class="cms-drawer-scrim" (click)="closeForm()" aria-label="Close form"></button>
        <div class="cms-drawer-card">
          <div class="cms-drawer-head">
            <div>
              <h2>{{ editingId() ? 'Edit' : 'Create' }} {{ title }}</h2>
              <p class="cms-page-sub" style="margin-top: 0.25rem">Fields marked * are required.</p>
            </div>
            <button class="cms-btn cms-btn-ghost cms-btn-icon cms-btn-sm" type="button" (click)="closeForm()" aria-label="Close">
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </div>
          <div class="cms-drawer-body">
            @if (formError()) {
              <div class="cms-alert cms-alert-error">{{ formError() }}</div>
            }
            <form (ngSubmit)="save()">
              @for (field of fields; track field.key) {
                <div class="cms-field">
                  <label class="cms-label" [for]="'f-' + field.key">
                    {{ field.label }}
                    <span class="req" *ngIf="field.required">*</span>
                  </label>
                  @if (field.type === 'textarea') {
                    <textarea
                      class="cms-textarea"
                      [id]="'f-' + field.key"
                      rows="5"
                      [(ngModel)]="form[field.key]"
                      [name]="field.key"
                      [placeholder]="field.placeholder || ''"
                      [required]="!!field.required"
                    ></textarea>
                  } @else if (field.type === 'select') {
                    <select
                      class="cms-select"
                      [id]="'f-' + field.key"
                      [(ngModel)]="form[field.key]"
                      [name]="field.key"
                      [required]="!!field.required"
                    >
                      @for (opt of field.options || []; track opt) {
                        <option [value]="opt">{{ opt }}</option>
                      }
                    </select>
                  } @else if (field.type === 'checkbox') {
                    <label class="cms-check">
                      <input type="checkbox" [(ngModel)]="form[field.key]" [name]="field.key" [id]="'f-' + field.key" />
                      <span>{{ field.placeholder || 'Enabled' }}</span>
                    </label>
                  } @else {
                    <input
                      class="cms-input"
                      [id]="'f-' + field.key"
                      [type]="field.type || 'text'"
                      [(ngModel)]="form[field.key]"
                      [name]="field.key"
                      [placeholder]="field.placeholder || ''"
                      [required]="!!field.required"
                    />
                  }
                </div>
              }
              <div class="cms-drawer-actions">
                <button class="cms-btn cms-btn-primary" type="submit" [disabled]="saving()">
                  {{ saving() ? 'Saving…' : 'Save changes' }}
                </button>
                <button class="cms-btn cms-btn-ghost" type="button" (click)="closeForm()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .cms-drawer {
        grid-template-columns: 1fr min(100%, 30rem);
      }
      .cms-drawer-scrim {
        border: 0;
        background: transparent;
        cursor: pointer;
      }
    `,
  ],
})
export class CmsResourceComponent implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input({ required: true }) endpoint!: string;
  @Input({ required: true }) columns!: ResourceColumn[];
  @Input() fields: ResourceField[] = [];
  @Input() publishable = false;
  @Input() readOnly = false;
  @Input() canDelete = true;
  @Input() createPayload: (form: Record<string, any>) => Record<string, any> = (f) => f;

  private readonly api = inject(ApiService);
  private bannerTimer?: ReturnType<typeof setTimeout>;

  readonly items = signal<any[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly formError = signal('');
  readonly banner = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  q = '';
  form: Record<string, any> = {};

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if (this.bannerTimer) {
      clearTimeout(this.bannerTimer);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showForm()) {
      this.closeForm();
    }
  }

  load(): void {
    this.loading.set(true);
    this.api.get<any>(this.endpoint, { q: this.q || undefined, per_page: 50 }).subscribe({
      next: (res) => {
        this.items.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.items.set([]);
        this.loading.set(false);
        this.setBanner('error', this.errorMessage(err, 'Failed to load records.'));
      },
    });
  }

  clearSearch(): void {
    this.q = '';
    this.load();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = {};
    this.fields.forEach((f) => {
      if (f.type === 'checkbox') {
        this.form[f.key] = false;
      } else if (f.type === 'select') {
        this.form[f.key] = f.options?.[0] || '';
      } else {
        this.form[f.key] = '';
      }
    });
    this.formError.set('');
    this.showForm.set(true);
  }

  edit(row: any): void {
    this.editingId.set(row.id);
    this.form = { ...row };
    this.formError.set('');
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    this.saving.set(true);
    this.formError.set('');
    const payload = this.createPayload({ ...this.form });
    const id = this.editingId();
    const req = id ? this.api.put(`${this.endpoint}/${id}`, payload) : this.api.post(this.endpoint, payload);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.setBanner('success', 'Saved successfully.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(this.errorMessage(err, 'Unable to save.'));
      },
    });
  }

  publish(row: any): void {
    this.api.post(`${this.endpoint}/${row.id}/publish`).subscribe({
      next: () => {
        this.setBanner('success', 'Published successfully.');
        this.load();
      },
      error: (err) => this.setBanner('error', this.errorMessage(err, 'Publish failed.')),
    });
  }

  remove(row: any): void {
    const label = row.title || row.name || row.label || row.client_name || row.id;
    if (!confirm(`Delete “${label}”? This cannot be undone.`)) {
      return;
    }
    this.api.delete(`${this.endpoint}/${row.id}`).subscribe({
      next: () => {
        this.setBanner('success', 'Deleted.');
        this.load();
      },
      error: (err) => this.setBanner('error', this.errorMessage(err, 'Delete failed.')),
    });
  }

  statusClass(status: string): string {
    const key = String(status || '').toLowerCase();
    if (['published', 'active', 'won', 'hired'].includes(key)) return 'cms-badge-published';
    if (['draft', 'new'].includes(key)) return 'cms-badge-draft';
    if (['scheduled', 'interview', 'shortlisted', 'ongoing'].includes(key)) return 'cms-badge-scheduled';
    if (['archived', 'rejected', 'lost', 'completed'].includes(key)) return 'cms-badge-archived';
    return 'cms-badge-default';
  }

  displayValue(row: any, key: string): string {
    const value = row[key];
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private setBanner(type: 'success' | 'error', text: string): void {
    this.banner.set({ type, text });
    if (this.bannerTimer) {
      clearTimeout(this.bannerTimer);
    }
    this.bannerTimer = setTimeout(() => this.banner.set(null), 4500);
  }

  private errorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body?.message) return body.message;
      if (body?.errors) {
        const first = Object.values(body.errors).flat()[0];
        if (first) return String(first);
      }
    }
    return fallback;
  }
}
