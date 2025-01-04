import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eob-link',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  link = input.required<string>();
}
