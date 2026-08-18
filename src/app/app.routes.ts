import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./website/layout/website-layout').then((m) => m.WebsiteLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./website/home/home').then((m) => m.HomeComponent) },
      {
        path: 'about',
        loadComponent: () => import('./website/pages/cms-page').then((m) => m.CmsPublicPageComponent),
        data: { slug: 'about' },
      },
      {
        path: 'services',
        loadComponent: () => import('./website/pages/cms-page').then((m) => m.CmsPublicPageComponent),
        data: { slug: 'services' },
      },
      {
        path: 'digital-agriculture',
        loadComponent: () => import('./website/pages/cms-page').then((m) => m.CmsPublicPageComponent),
        data: { slug: 'digital-agriculture' },
      },
      {
        path: 'digital-economy',
        loadComponent: () => import('./website/pages/cms-page').then((m) => m.CmsPublicPageComponent),
        data: { slug: 'digital-economy' },
      },
      { path: 'projects', loadComponent: () => import('./website/pages/content-pages').then((m) => m.ProjectsListComponent) },
      {
        path: 'projects/:slug',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.ProjectsDetailComponent),
      },
      {
        path: 'programmes',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.ProgrammesListComponent),
      },
      {
        path: 'programmes/:slug',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.ProgrammesDetailComponent),
      },
      { path: 'news', loadComponent: () => import('./website/pages/content-pages').then((m) => m.NewsListComponent) },
      { path: 'news/:slug', loadComponent: () => import('./website/pages/content-pages').then((m) => m.NewsDetailComponent) },
      { path: 'events', loadComponent: () => import('./website/pages/content-pages').then((m) => m.EventsListComponent) },
      {
        path: 'events/:slug',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.EventsDetailComponent),
      },
      {
        path: 'events/:slug/register',
        loadComponent: () => import('./website/pages/forms-pages').then((m) => m.EventRegisterComponent),
      },
      {
        path: 'publications',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.PublicationsListComponent),
      },
      {
        path: 'publications/:slug',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.PublicationsDetailComponent),
      },
      { path: 'careers', loadComponent: () => import('./website/pages/content-pages').then((m) => m.CareersListComponent) },
      {
        path: 'careers/:slug',
        loadComponent: () => import('./website/pages/content-pages').then((m) => m.CareersDetailComponent),
      },
      {
        path: 'careers/:slug/apply',
        loadComponent: () => import('./website/pages/forms-pages').then((m) => m.CareerApplyComponent),
      },
      { path: 'partners', loadComponent: () => import('./website/pages/static-pages').then((m) => m.PartnersPageComponent) },
      { path: 'media', loadComponent: () => import('./website/pages/static-pages').then((m) => m.MediaPageComponent) },
      { path: 'contact', loadComponent: () => import('./website/pages/static-pages').then((m) => m.ContactComponent) },
      { path: 'search', loadComponent: () => import('./website/pages/static-pages').then((m) => m.SearchPageComponent) },
      { path: 'p/:slug', loadComponent: () => import('./website/pages/cms-page').then((m) => m.CmsPublicPageComponent) },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./cms/auth/login').then((m) => m.CmsLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./cms/layout/cms-layout').then((m) => m.CmsLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./cms/dashboard/dashboard').then((m) => m.CmsDashboardComponent) },
      { path: 'pages', loadComponent: () => import('./cms/pages/pages-admin').then((m) => m.CmsPagesAdminComponent) },
      { path: 'menus', loadComponent: () => import('./cms/menus/menus-admin').then((m) => m.CmsMenusAdminComponent) },
      { path: 'news', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsNewsComponent) },
      { path: 'blog', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsBlogComponent) },
      { path: 'projects', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsProjectsComponent) },
      { path: 'programmes', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsProgrammesComponent) },
      { path: 'events', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsEventsComponent) },
      { path: 'publications', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsPublicationsComponent) },
      { path: 'media', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsMediaComponent) },
      { path: 'partners', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsPartnersComponent) },
      { path: 'testimonials', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsTestimonialsComponent) },
      { path: 'careers', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsCareersComponent) },
      { path: 'applications', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsApplicationsComponent) },
      { path: 'leads', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsLeadsComponent) },
      { path: 'newsletter', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsNewsletterComponent) },
      { path: 'forms', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsFormsComponent) },
      { path: 'seo', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsSeoComponent) },
      { path: 'analytics', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsAnalyticsComponent) },
      { path: 'users', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsUsersComponent) },
      { path: 'roles', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsRolesComponent) },
      { path: 'settings', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsSettingsComponent) },
      { path: 'audit', loadComponent: () => import('./cms/modules/cms-modules').then((m) => m.CmsAuditComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
