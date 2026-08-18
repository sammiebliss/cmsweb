import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';

interface MenuItemForm {
  label: string;
  url: string;
  children: Array<{ label: string; url: string }>;
}

@Component({
  selector: 'app-cms-menus-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Menus</h1>
        <p class="cms-page-sub">Nested navigation for header dropdowns and footer columns. Expand a menu to edit.</p>
      </div>
      <button class="cms-btn cms-btn-ghost" type="button" (click)="reload()" [disabled]="loading()">
        <i class="pi pi-refresh" aria-hidden="true"></i>
        Refresh
      </button>
    </div>

    @if (error()) {
      <div class="cms-alert cms-alert-error">{{ error() }}</div>
    }
    @if (success()) {
      <div class="cms-alert cms-alert-success">{{ success() }}</div>
    }

    @if (loading()) {
      <div class="cms-panel">
        <div class="cms-skeleton" style="height: 3.2rem; margin-bottom: 0.65rem"></div>
        <div class="cms-skeleton" style="height: 3.2rem"></div>
      </div>
    } @else {
      <div class="menus-stack">
        @for (menu of menus(); track menu.id) {
          <div class="cms-panel menu-card" [class.is-open]="expandedId() === menu.id">
            <button
              type="button"
              class="menu-toggle"
              (click)="toggle(menu.id)"
              [attr.aria-expanded]="expandedId() === menu.id"
              [attr.aria-controls]="'menu-panel-' + menu.id"
            >
              <span class="menu-toggle-main">
                <span class="chev" aria-hidden="true">
                  <i class="pi" [class.pi-chevron-down]="expandedId() === menu.id" [class.pi-chevron-right]="expandedId() !== menu.id"></i>
                </span>
                <span>
                  <span class="menu-name">{{ menu.name }}</span>
                  <span class="menu-meta">
                    <span class="cms-badge cms-badge-default">{{ menu.location }}</span>
                    <span class="item-count">{{ itemCount(menu.id) }} item{{ itemCount(menu.id) === 1 ? '' : 's' }}</span>
                  </span>
                </span>
              </span>
              <span class="menu-toggle-hint">{{ expandedId() === menu.id ? 'Collapse' : 'Manage' }}</span>
            </button>

            @if (expandedId() === menu.id) {
              <div class="menu-body" [id]="'menu-panel-' + menu.id">
                <div class="menu-actions">
                  <button
                    class="cms-btn cms-btn-primary cms-btn-sm"
                    type="button"
                    (click)="save(menu)"
                    [disabled]="savingId() === menu.id"
                  >
                    {{ savingId() === menu.id ? 'Saving…' : 'Save menu' }}
                  </button>
                  <button class="cms-btn cms-btn-brand cms-btn-sm" type="button" (click)="addTop(menu.id)">
                    + Top-level item
                  </button>
                </div>

                @for (item of drafts()[menu.id]; track $index; let i = $index) {
                  <div class="menu-item-block">
                    <div class="item-row">
                      <div class="cms-field" style="margin: 0">
                        <label class="cms-label">Label</label>
                        <input class="cms-input" [(ngModel)]="item.label" [name]="'l' + menu.id + i" />
                      </div>
                      <div class="cms-field" style="margin: 0">
                        <label class="cms-label">URL</label>
                        <input class="cms-input" [(ngModel)]="item.url" [name]="'u' + menu.id + i" />
                      </div>
                      <button
                        class="cms-btn cms-btn-danger cms-btn-sm remove-btn"
                        type="button"
                        (click)="removeTop(menu.id, i)"
                      >
                        Remove
                      </button>
                    </div>

                    <div class="children">
                      <div class="children-label">Submenu items</div>
                      @for (child of item.children; track $index; let ci = $index) {
                        <div class="child-row">
                          <input
                            class="cms-input"
                            [(ngModel)]="child.label"
                            [name]="'cl' + menu.id + i + ci"
                            placeholder="Label"
                          />
                          <input
                            class="cms-input"
                            [(ngModel)]="child.url"
                            [name]="'cu' + menu.id + i + ci"
                            placeholder="/path"
                          />
                          <button
                            class="cms-btn cms-btn-ghost cms-btn-icon cms-btn-sm"
                            type="button"
                            (click)="removeChild(menu.id, i, ci)"
                            aria-label="Remove submenu item"
                          >
                            ×
                          </button>
                        </div>
                      }
                      <button class="cms-btn cms-btn-ghost cms-btn-sm" type="button" (click)="addChild(menu.id, i)">
                        + Submenu
                      </button>
                    </div>
                  </div>
                } @empty {
                  <div class="cms-empty" style="padding: 1.25rem 0.5rem">
                    <strong>No items in this menu</strong>
                    <span>Add a top-level item to start building navigation.</span>
                  </div>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="cms-panel cms-empty">
            <strong>No menus found</strong>
            <span>Seed the menus table or create menus via API.</span>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .menus-stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 52rem;
      }
      .menu-card {
        padding: 0;
        overflow: hidden;
      }
      .menu-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        border: 0;
        background: transparent;
        padding: 1rem 1.15rem;
        cursor: pointer;
        text-align: left;
        font: inherit;
        color: inherit;
        transition: background 0.15s;
      }
      .menu-toggle:hover {
        background: color-mix(in srgb, var(--cms-sand) 80%, white);
      }
      .menu-card.is-open .menu-toggle {
        border-bottom: 1px solid var(--cms-line);
        background: color-mix(in srgb, var(--cms-sand) 65%, white);
      }
      .menu-toggle-main {
        display: flex;
        align-items: flex-start;
        gap: 0.7rem;
        min-width: 0;
      }
      .chev {
        width: 1.65rem;
        height: 1.65rem;
        border-radius: 0.5rem;
        display: grid;
        place-items: center;
        background: var(--cms-mist);
        color: var(--cms-brand);
        flex-shrink: 0;
        margin-top: 0.1rem;
      }
      .menu-name {
        display: block;
        font-family: var(--cms-display);
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.2;
      }
      .menu-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        margin-top: 0.4rem;
      }
      .item-count {
        font-size: 0.78rem;
        color: var(--cms-muted);
        font-weight: 600;
      }
      .menu-toggle-hint {
        flex-shrink: 0;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--cms-brand);
      }
      .menu-body {
        padding: 1rem 1.15rem 1.15rem;
        animation: menuOpen 0.18s ease both;
      }
      @keyframes menuOpen {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .menu-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 0.9rem;
      }
      .menu-item-block {
        padding: 0.9rem;
        border-radius: 0.9rem;
        background: var(--cms-sand);
        border: 1px solid var(--cms-line);
        margin-bottom: 0.75rem;
      }
      .item-row {
        display: grid;
        gap: 0.55rem;
      }
      @media (min-width: 640px) {
        .item-row {
          grid-template-columns: 1fr 1fr auto;
          align-items: end;
        }
      }
      .remove-btn {
        height: 2.55rem;
      }
      .children {
        margin-top: 0.75rem;
        padding-left: 0.75rem;
        border-left: 2px solid color-mix(in srgb, var(--cms-glow) 55%, var(--cms-line));
      }
      .children-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--cms-muted);
        font-weight: 700;
        margin-bottom: 0.45rem;
      }
      .child-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 0.45rem;
        margin-bottom: 0.45rem;
      }
    `,
  ],
})
export class CmsMenusAdminComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly menus = signal<any[]>([]);
  readonly drafts = signal<Record<number, MenuItemForm[]>>({});
  readonly loading = signal(true);
  readonly savingId = signal<number | null>(null);
  readonly expandedId = signal<number | null>(null);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    this.reload();
  }

  toggle(menuId: number): void {
    this.expandedId.set(this.expandedId() === menuId ? null : menuId);
  }

  itemCount(menuId: number): number {
    return (this.drafts()[menuId] || []).length;
  }

  reload(): void {
    this.loading.set(true);
    const previous = this.expandedId();
    this.api.get<any>('menus').subscribe({
      next: (res) => {
        const list = res.data || [];
        this.menus.set(list);
        const next: Record<number, MenuItemForm[]> = {};
        for (const menu of list) {
          const items = (menu.items || menu.all_items || [])
            .slice()
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          next[menu.id] = items.map((item: any) => ({
            label: item.label || '',
            url: item.url || '',
            children: (item.children || [])
              .slice()
              .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((c: any) => ({ label: c.label || '', url: c.url || '' })),
          }));
        }
        this.drafts.set(next);
        // Keep current open menu if it still exists; otherwise collapse all
        if (previous != null && list.some((m: any) => m.id === previous)) {
          this.expandedId.set(previous);
        } else {
          this.expandedId.set(null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Unable to load menus.');
        this.loading.set(false);
      },
    });
  }

  addTop(menuId: number): void {
    this.expandedId.set(menuId);
    const d = { ...this.drafts() };
    d[menuId] = [...(d[menuId] || []), { label: 'New item', url: '/', children: [] }];
    this.drafts.set(d);
  }

  removeTop(menuId: number, index: number): void {
    const d = { ...this.drafts() };
    d[menuId] = (d[menuId] || []).filter((_, i) => i !== index);
    this.drafts.set(d);
  }

  addChild(menuId: number, index: number): void {
    const d = { ...this.drafts() };
    const items = [...(d[menuId] || [])];
    const item = { ...items[index], children: [...items[index].children, { label: 'Sub item', url: '/' }] };
    items[index] = item;
    d[menuId] = items;
    this.drafts.set(d);
  }

  removeChild(menuId: number, index: number, childIndex: number): void {
    const d = { ...this.drafts() };
    const items = [...(d[menuId] || [])];
    items[index] = {
      ...items[index],
      children: items[index].children.filter((_, i) => i !== childIndex),
    };
    d[menuId] = items;
    this.drafts.set(d);
  }

  save(menu: any): void {
    this.savingId.set(menu.id);
    this.error.set('');
    this.success.set('');
    const items = (this.drafts()[menu.id] || []).map((item, index) => ({
      label: item.label,
      url: item.url,
      type: 'internal',
      sort_order: index,
      children: (item.children || []).map((child, ci) => ({
        label: child.label,
        url: child.url,
        type: 'internal',
        sort_order: ci,
      })),
    }));

    this.api.put(`menus/${menu.id}`, { name: menu.name, location: menu.location, items }).subscribe({
      next: () => {
        this.success.set(`${menu.name} saved.`);
        this.savingId.set(null);
        this.expandedId.set(menu.id);
        this.reload();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Save failed.');
        this.savingId.set(null);
      },
    });
  }
}
