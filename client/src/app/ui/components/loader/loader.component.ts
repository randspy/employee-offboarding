import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'eob-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  size = input<'small' | 'medium' | 'large'>('medium');
}
