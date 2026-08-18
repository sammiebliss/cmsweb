import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    robots?: string;
  } | null, fallbackTitle = 'Digital Check Nigeria'): void {
    const pageTitle = seo?.meta_title || seo?.og_title || fallbackTitle;
    this.title.setTitle(pageTitle);

    this.setTag('description', seo?.meta_description || '');
    this.setTag('keywords', seo?.meta_keywords || '');
    this.setTag('robots', seo?.robots || 'index,follow');
    this.setProperty('og:title', seo?.og_title || pageTitle);
    this.setProperty('og:description', seo?.og_description || seo?.meta_description || '');
    this.setProperty('og:image', seo?.og_image || '');
  }

  private setTag(name: string, content: string): void {
    if (!content) {
      return;
    }
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    if (!content) {
      return;
    }
    this.meta.updateTag({ property, content });
  }
}
