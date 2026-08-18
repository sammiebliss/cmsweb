import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-event-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <a [routerLink]="['/events', slug]" class="dc-back">← Back to event</a>
        <span class="dc-kicker !text-glow">Events</span>
        <h1 class="mt-3 font-display text-3xl text-white sm:text-4xl">Event registration</h1>
        <p class="mt-3 max-w-xl text-sm text-white/75 sm:text-base">Secure your place — we will confirm by email.</p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container max-w-lg">
        <form class="dc-card space-y-4 p-6 sm:p-8" (ngSubmit)="submit()">
          <div class="dc-field">
            <label class="dc-label" for="er-name">Name</label>
            <input id="er-name" class="dc-input" [(ngModel)]="form.name" name="name" required autocomplete="name" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="er-email">Email</label>
            <input
              id="er-email"
              type="email"
              class="dc-input"
              [(ngModel)]="form.email"
              name="email"
              required
              autocomplete="email"
            />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="er-phone">Phone</label>
            <input id="er-phone" class="dc-input" [(ngModel)]="form.phone" name="phone" autocomplete="tel" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="er-org">Organization</label>
            <input id="er-org" class="dc-input" [(ngModel)]="form.organization" name="organization" />
          </div>
          <div class="flex flex-wrap gap-3 pt-2">
            <button class="dc-btn-dark" type="submit" [disabled]="sending">
              {{ sending ? 'Submitting…' : 'Register' }}
            </button>
            <a class="dc-btn-outline" [routerLink]="['/events', slug]">Cancel</a>
          </div>
          @if (message) {
            <p class="rounded-2xl bg-mist px-4 py-3 text-sm text-brand" role="status">{{ message }}</p>
          }
        </form>
      </div>
    </section>
  `,
})
export class EventRegisterComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  slug = this.route.snapshot.paramMap.get('slug') || '';
  form = { name: '', email: '', phone: '', organization: '' };
  message = '';
  sending = false;
  submit(): void {
    this.sending = true;
    this.api.post(`public/events/${this.slug}/register`, this.form).subscribe({
      next: () => {
        this.message = 'Registration successful. Check your email for confirmation.';
        this.sending = false;
      },
      error: (err) => {
        this.message = err?.error?.message || 'Registration failed. Please try again.';
        this.sending = false;
      },
    });
  }
}

@Component({
  selector: 'app-career-apply',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="dc-page-hero">
      <div class="dc-container py-9 sm:py-12">
        <a [routerLink]="['/careers', slug]" class="dc-back">← Back to role</a>
        <span class="dc-kicker !text-glow">Careers</span>
        <h1 class="mt-3 font-display text-3xl text-white sm:text-4xl">Apply for this role</h1>
        <p class="mt-3 max-w-xl text-sm text-white/75 sm:text-base">
          Tell us about yourself — we review every application carefully.
        </p>
      </div>
    </section>
    <section class="dc-section">
      <div class="dc-container max-w-lg">
        <form class="dc-card space-y-4 p-6 sm:p-8" (ngSubmit)="submit()">
          <div class="dc-field">
            <label class="dc-label" for="ca-name">Name</label>
            <input id="ca-name" class="dc-input" [(ngModel)]="form.name" name="name" required autocomplete="name" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="ca-email">Email</label>
            <input
              id="ca-email"
              type="email"
              class="dc-input"
              [(ngModel)]="form.email"
              name="email"
              required
              autocomplete="email"
            />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="ca-phone">Phone</label>
            <input id="ca-phone" class="dc-input" [(ngModel)]="form.phone" name="phone" autocomplete="tel" />
          </div>
          <div class="dc-field">
            <label class="dc-label" for="ca-letter">Cover letter</label>
            <textarea
              id="ca-letter"
              class="dc-input min-h-32"
              rows="5"
              [(ngModel)]="form.cover_letter"
              name="cover_letter"
            ></textarea>
          </div>
          <div class="flex flex-wrap gap-3 pt-2">
            <button class="dc-btn-dark" type="submit" [disabled]="sending">
              {{ sending ? 'Submitting…' : 'Submit application' }}
            </button>
            <a class="dc-btn-outline" [routerLink]="['/careers', slug]">Cancel</a>
          </div>
          @if (message) {
            <p class="rounded-2xl bg-mist px-4 py-3 text-sm text-brand" role="status">{{ message }}</p>
          }
        </form>
      </div>
    </section>
  `,
})
export class CareerApplyComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  slug = this.route.snapshot.paramMap.get('slug') || '';
  form = { name: '', email: '', phone: '', cover_letter: '' };
  message = '';
  sending = false;
  submit(): void {
    this.sending = true;
    this.api.post(`public/careers/${this.slug}/apply`, this.form).subscribe({
      next: () => {
        this.message = 'Application submitted. We will be in touch if there is a match.';
        this.sending = false;
      },
      error: () => {
        this.message = 'Unable to submit application. Please try again or email us.';
        this.sending = false;
      },
    });
  }
}

@Component({
  selector: 'app-newsletter-footer-inline',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="flex flex-col gap-2 sm:flex-row" (ngSubmit)="subscribe()">
      <label class="sr-only" for="nl-email">Email for newsletter</label>
      <input
        id="nl-email"
        class="dc-input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/50"
        type="email"
        [(ngModel)]="email"
        name="email"
        placeholder="Email for newsletter"
        required
      />
      <button class="dc-btn-primary shrink-0" type="submit">Subscribe</button>
    </form>
    @if (msg) {
      <p class="mt-2 text-sm text-white/70">{{ msg }}</p>
    }
  `,
})
export class NewsletterInlineComponent {
  private readonly api = inject(ApiService);
  email = '';
  msg = '';
  subscribe(): void {
    this.api.post('public/newsletter/subscribe', { email: this.email }).subscribe({
      next: () => {
        this.msg = 'Subscribed — thank you.';
        this.email = '';
      },
      error: () => (this.msg = 'Could not subscribe right now.'),
    });
  }
}
