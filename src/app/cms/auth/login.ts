import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cms-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-visual" aria-hidden="true">
        <div class="glow"></div>
        <div class="brand-block">
          <span class="mark">DC</span>
          <h1>Digital Check Nigeria</h1>
          <p>Manage website content, portfolio, leads and brand settings from one place.</p>
        </div>
      </div>

      <div class="login-side">
        <form class="login-card" (ngSubmit)="submit()">
          <p class="eyebrow">CMS Access</p>
          <h2>Sign in</h2>
          <p class="lead">Use your staff credentials to continue.</p>

          <div class="cms-field">
            <label class="cms-label" for="login-email">Email</label>
            <input
              id="login-email"
              class="cms-input"
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="username"
              placeholder="you@digitalcheck.ng"
            />
          </div>
          <div class="cms-field">
            <label class="cms-label" for="login-password">Password</label>
            <input
              id="login-password"
              class="cms-input"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
            />
          </div>

          @if (error) {
            <div class="cms-alert cms-alert-error" role="alert">{{ error }}</div>
          }

          <button class="cms-btn cms-btn-primary" style="width: 100%; min-height: 2.85rem" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign in to CMS' }}
          </button>

          <a class="back-link" routerLink="/">← Back to public site</a>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        background: var(--cms-paper, #f6f8f5);
      }
      .login-visual {
        position: relative;
        overflow: hidden;
        background: linear-gradient(145deg, #041812 0%, #0b3d2e 50%, #0f2f3a 100%);
        color: #fff;
        padding: 3rem;
        display: flex;
        align-items: flex-end;
      }
      .glow {
        position: absolute;
        width: 22rem;
        height: 22rem;
        border-radius: 999px;
        background: rgb(168 232 106 / 0.18);
        filter: blur(30px);
        top: 10%;
        left: -10%;
      }
      .brand-block {
        position: relative;
        max-width: 26rem;
      }
      .mark {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border-radius: 0.9rem;
        background: linear-gradient(145deg, #c5f08a, #1a8f63);
        color: #071612;
        font-weight: 800;
        margin-bottom: 1.25rem;
      }
      .brand-block h1 {
        margin: 0;
        font-family: var(--cms-display), Georgia, serif;
        font-size: clamp(2rem, 3vw, 2.6rem);
        font-weight: 500;
        letter-spacing: -0.03em;
      }
      .brand-block p {
        margin: 0.85rem 0 0;
        color: rgb(255 255 255 / 0.78);
        line-height: 1.55;
      }
      .login-side {
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }
      .login-card {
        width: min(100%, 24.5rem);
        background: #fff;
        border: 1px solid var(--cms-line, #d5e3db);
        border-radius: 1.25rem;
        box-shadow: var(--cms-shadow, 0 12px 32px -18px rgb(7 22 18 / 0.18));
        padding: 1.75rem;
      }
      .eyebrow {
        margin: 0;
        font-size: 0.7rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--cms-leaf, #1a8f63);
      }
      h2 {
        margin: 0.4rem 0 0;
        font-family: var(--cms-display), Georgia, serif;
        font-size: 1.85rem;
        font-weight: 500;
      }
      .lead {
        margin: 0.4rem 0 1.35rem;
        color: var(--cms-muted, #5a7268);
        font-size: 0.92rem;
      }
      .back-link {
        display: inline-block;
        margin-top: 1rem;
        color: var(--cms-brand, #0f5c45);
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 600;
      }
      .back-link:hover {
        color: var(--cms-leaf, #1a8f63);
      }
      @media (max-width: 900px) {
        .login-page {
          grid-template-columns: 1fr;
        }
        .login-visual {
          min-height: 32vh;
          padding: 1.75rem;
        }
      }
    `,
  ],
})
export class CmsLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';
  loading = false;
  error = '';

  submit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.error?.errors?.email?.[0] || 'Login failed';
      },
    });
  }
}
