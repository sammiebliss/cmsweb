import { Component, inject } from '@angular/core';
import { ContentListComponent, ContentDetailComponent } from '../shared/content-views';

@Component({ selector: 'app-news-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/news" basePath="/news" pageTitle="News & Insights" pageSubtitle="Stories, announcements and thought leadership from Digital Check." />` })
export class NewsListComponent {}

@Component({ selector: 'app-news-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/news" basePath="/news" />` })
export class NewsDetailComponent {}

@Component({ selector: 'app-projects-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/projects" basePath="/projects" pageTitle="Portfolio" pageSubtitle="Selected digital agriculture, enterprise platform, M&E and capacity-building engagements." titleField="name" />` })
export class ProjectsListComponent {}

@Component({ selector: 'app-projects-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/projects" basePath="/projects" titleField="name" />` })
export class ProjectsDetailComponent {}

@Component({ selector: 'app-programmes-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/programmes" basePath="/programmes" pageTitle="Programmes" pageSubtitle="Multi-stakeholder programmes spanning extension digitalisation, youth skills, MSME digitization and women in agri-tech." titleField="name" />` })
export class ProgrammesListComponent {}

@Component({ selector: 'app-programmes-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/programmes" basePath="/programmes" titleField="name" />` })
export class ProgrammesDetailComponent {}

@Component({ selector: 'app-events-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/events" basePath="/events" pageTitle="Events" pageSubtitle="Upcoming trainings, webinars and stakeholder sessions." />` })
export class EventsListComponent {}

@Component({ selector: 'app-events-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/events" basePath="/events" />` })
export class EventsDetailComponent {}

@Component({ selector: 'app-publications-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/publications" basePath="/publications" pageTitle="Publications" pageSubtitle="Reports, white papers and research." />` })
export class PublicationsListComponent {}

@Component({ selector: 'app-publications-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/publications" basePath="/publications" />` })
export class PublicationsDetailComponent {}

@Component({ selector: 'app-careers-list', standalone: true, imports: [ContentListComponent], template: `<app-content-list endpoint="public/careers" basePath="/careers" pageTitle="Careers" pageSubtitle="Join Digital Check Nigeria." />` })
export class CareersListComponent {}

@Component({ selector: 'app-careers-detail', standalone: true, imports: [ContentDetailComponent], template: `<app-content-detail endpoint="public/careers" basePath="/careers" />` })
export class CareersDetailComponent {}
