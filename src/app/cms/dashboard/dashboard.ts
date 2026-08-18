import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-cms-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="cms-page-head">
      <div>
        <h1 class="cms-page-title">Dashboard</h1>
        <p class="cms-page-sub">Operational snapshot across content, engagement and delivery.</p>
      </div>
      <div class="cms-toolbar">
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/leads">Leads</a>
        <a class="cms-btn cms-btn-primary" routerLink="/admin/pages">Manage pages</a>
      </div>
    </div>

    @if (loading()) {
      <div class="cms-stat-grid" style="margin-bottom: 1rem">
        @for (s of [1, 2, 3, 4]; track s) {
          <div class="cms-stat"><div class="cms-skeleton" style="height: 2rem; width: 40%"></div></div>
        }
      </div>
    } @else {
      <div class="cms-stat-grid" style="margin-bottom: 1rem">
        @for (card of cards(); track card.label) {
          <div class="cms-stat">
            <div class="value">{{ card.value }}</div>
            <div class="label">{{ card.label }}</div>
          </div>
        }
      </div>
    }

    <div class="cms-grid-2">
      <div class="cms-panel">
        <div class="cms-page-head" style="margin-bottom: 0.5rem">
          <h2 class="cms-page-title" style="font-size: 1.25rem">Top pages</h2>
          <a class="cms-btn cms-btn-ghost cms-btn-sm" routerLink="/admin/analytics">Analytics</a>
        </div>
        @for (p of topPages(); track p.path) {
          <div class="cms-list-row">
            <span style="word-break: break-all">{{ p.path }}</span>
            <strong>{{ p.views }}</strong>
          </div>
        } @empty {
          <div class="cms-empty" style="padding: 1.5rem 0.5rem">
            <strong>No analytics yet</strong>
            <span>Traffic will appear after public visits are tracked.</span>
          </div>
        }
      </div>

      <div class="cms-panel">
        <div class="cms-page-head" style="margin-bottom: 0.5rem">
          <h2 class="cms-page-title" style="font-size: 1.25rem">Recent leads</h2>
          <a class="cms-btn cms-btn-ghost cms-btn-sm" routerLink="/admin/leads">View all</a>
        </div>
        @for (lead of recentLeads(); track lead.id) {
          <div class="cms-list-row" style="flex-direction: column; align-items: flex-start">
            <strong>{{ lead.name }}</strong>
            <span style="color: var(--cms-muted); font-size: 0.84rem">
              {{ lead.email }} · <span class="cms-badge cms-badge-default">{{ lead.status }}</span>
            </span>
          </div>
        } @empty {
          <div class="cms-empty" style="padding: 1.5rem 0.5rem">
            <strong>No leads yet</strong>
            <span>Contact form submissions will land here.</span>
          </div>
        }
      </div>
    </div>

    <div class="cms-panel" style="margin-top: 1rem">
      <h2 class="cms-page-title" style="font-size: 1.25rem; margin-bottom: 0.75rem">Quick actions</h2>
      <div class="cms-toolbar">
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/news">Add news</a>
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/projects">Add project</a>
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/menus">Edit menus</a>
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/settings">Brand settings</a>
        <a class="cms-btn cms-btn-ghost" routerLink="/admin/media">Media library</a>
      </div>
    </div>
  `,
})
export class CmsDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly cards = signal<Array<{ label: string; value: number | string }>>([]);
  readonly topPages = signal<any[]>([]);
  readonly recentLeads = signal<any[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.get<any>('dashboard').subscribe({
      next: (res) => {
        const c = res.data?.counts || {};
        this.cards.set([
          { label: 'Visitors (30d)', value: c.visitors_30d || 0 },
          { label: 'Leads', value: c.leads || 0 },
          { label: 'New leads', value: c.new_leads || 0 },
          { label: 'Event regs', value: c.event_registrations || 0 },
          { label: 'Pages', value: c.pages || 0 },
          { label: 'News', value: c.news || 0 },
          { label: 'Projects', value: c.projects || 0 },
          { label: 'Downloads', value: c.downloads || 0 },
        ]);
        this.topPages.set(res.data?.top_pages || []);
        this.recentLeads.set(res.data?.recent_leads || []);
        this.loading.set(false);
      },
      error: () => {
        this.cards.set([{ label: 'Leads', value: 0 }]);
        this.loading.set(false);
      },
    });
  }
}
