import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cms-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './cms-layout.html',
  styleUrl: './cms-layout.scss',
})
export class CmsLayoutComponent {
  readonly auth = inject(AuthService);
  readonly mobileOpen = signal(false);

  nav = [
    { group: 'Overview', items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-home' }] },
    {
      group: 'Content',
      items: [
        { label: 'Pages', path: '/admin/pages', icon: 'pi pi-file' },
        { label: 'Menus', path: '/admin/menus', icon: 'pi pi-bars' },
        { label: 'News', path: '/admin/news', icon: 'pi pi-bookmark' },
        { label: 'Blog', path: '/admin/blog', icon: 'pi pi-pencil' },
        { label: 'Media', path: '/admin/media', icon: 'pi pi-images' },
      ],
    },
    {
      group: 'Portfolio',
      items: [
        { label: 'Projects', path: '/admin/projects', icon: 'pi pi-briefcase' },
        { label: 'Programmes', path: '/admin/programmes', icon: 'pi pi-sitemap' },
        { label: 'Events', path: '/admin/events', icon: 'pi pi-calendar' },
        { label: 'Publications', path: '/admin/publications', icon: 'pi pi-book' },
        { label: 'Partners', path: '/admin/partners', icon: 'pi pi-users' },
        { label: 'Testimonials', path: '/admin/testimonials', icon: 'pi pi-comments' },
      ],
    },
    {
      group: 'Engagement',
      items: [
        { label: 'Leads', path: '/admin/leads', icon: 'pi pi-inbox' },
        { label: 'Careers', path: '/admin/careers', icon: 'pi pi-id-card' },
        { label: 'Applications', path: '/admin/applications', icon: 'pi pi-file-edit' },
        { label: 'Newsletter', path: '/admin/newsletter', icon: 'pi pi-envelope' },
        { label: 'Forms', path: '/admin/forms', icon: 'pi pi-list' },
      ],
    },
    {
      group: 'System',
      items: [
        { label: 'SEO / Redirects', path: '/admin/seo', icon: 'pi pi-directions' },
        { label: 'Analytics', path: '/admin/analytics', icon: 'pi pi-chart-bar' },
        { label: 'Users', path: '/admin/users', icon: 'pi pi-user' },
        { label: 'Roles', path: '/admin/roles', icon: 'pi pi-lock' },
        { label: 'Settings', path: '/admin/settings', icon: 'pi pi-cog' },
        { label: 'Audit Logs', path: '/admin/audit', icon: 'pi pi-history' },
      ],
    },
  ];

  toggleMobile(force?: boolean): void {
    this.mobileOpen.set(force ?? !this.mobileOpen());
    document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    document.body.style.overflow = '';
  }

  logout(): void {
    this.closeMobile();
    this.auth.logout();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 992 && this.mobileOpen()) {
      this.closeMobile();
    }
  }
}
