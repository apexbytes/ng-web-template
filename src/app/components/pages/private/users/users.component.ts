import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '@core/services/users.service';
import { AuthStore } from '@core/stores/auth.store';
import { Role } from '@core/dto/api.models';
import { createPagination } from '@core/utils/pagination.util';
import { InviteFormComponent } from '../forms/invite-form/invite-form.component';
import { ConfirmDialogComponent } from '../forms/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  imports: [DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly authStore    = inject(AuthStore);
  private readonly dialog       = inject(MatDialog);

  readonly currentUserId = computed(() => this.authStore.user()?.id);
  readonly pagination    = createPagination(1, 10);

  readonly usersResource = rxResource({
    params: () => this.pagination.params(),
    stream: ({ params }) => this.usersService.getAll(params),
  });

  readonly users = computed(() => this.usersResource.value()?.data ?? []);
  readonly meta  = computed(() => this.usersResource.value()?.meta ?? null);

  readonly totalPages = computed(() =>
    Math.ceil((this.meta()?.total ?? 0) / this.pagination.limit())
  );

  readonly showingFrom = computed(() => {
    const m = this.meta();
    return m ? (m.page - 1) * m.limit + 1 : 0;
  });

  readonly showingTo = computed(() => {
    const m = this.meta();
    return m ? Math.min(m.page * m.limit, m.total) : 0;
  });

  readonly pageRange = computed((): (number | null)[] => {
    const total = this.totalPages();
    const cur   = this.pagination.page();
    if (total <= 1) return [];
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 3)         return [1, 2, 3, 4, null, total];
    if (cur >= total - 2) return [1, null, total - 3, total - 2, total - 1, total];
    return [1, null, cur - 1, cur, cur + 1, null, total];
  });

  initials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');
  }

  roleBadgeClass(role: Role): string {
    return role === 'ADMIN' ? 'status-badge badge-admin' : 'status-badge badge-editor';
  }

  openInvite(): void {
    const ref = this.dialog.open(InviteFormComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '95%',
      maxWidth: '500px',
    });
    ref.afterClosed().subscribe(invited => {
      if (invited) this.usersResource.reload();
    });
  }

  deleteUser(id: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '90%',
      maxWidth: '400px',
      data: { message: 'Delete this user? This cannot be undone.' },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.usersService.delete(id).subscribe({
        next: () => this.usersResource.reload(),
      });
    });
  }
}
