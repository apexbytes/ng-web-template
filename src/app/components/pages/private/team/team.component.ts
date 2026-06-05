import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '@core/services/team.service';
import { TeamMember } from '@core/dto/api.models';
import { TeamFormComponent } from '../forms/team-form/team-form.component';
import { ConfirmDialogComponent } from '../forms/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-team',
  imports: [],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent {
  private readonly teamService = inject(TeamService);
  private readonly dialog      = inject(MatDialog);

  readonly teamResource = rxResource({
    stream: () => this.teamService.getAll(),
  });

  readonly members = computed(() => this.teamResource.value()?.data ?? []);

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');
  }

  socialsCount(socials: unknown[] | null): number {
    return socials?.length ?? 0;
  }

  private openForm(member?: TeamMember): void {
    const ref = this.dialog.open(TeamFormComponent, {
      disableClose: true,
      maxHeight: '90vh',
      maxWidth: '1400px',
      width: '95%',
      panelClass: 'full-screen-modal',
      data: member ? { member } : undefined,
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) this.teamResource.reload();
    });
  }

  openCreate(): void  { this.openForm(); }
  openEdit(member: TeamMember): void { this.openForm(member); }

  deleteTeamMember(id: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '90%',
      maxWidth: '400px',
      data: { message: 'Delete this team member? This cannot be undone.' },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.teamService.delete(id).subscribe({
        next: () => this.teamResource.reload(),
      });
    });
  }
}
