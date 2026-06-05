import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuillEditorComponent } from 'ngx-quill';

const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'blockquote', 'image', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
};

@Component({
  selector: 'app-rich-editor',
  imports: [QuillEditorComponent, ReactiveFormsModule],
  templateUrl: './rich-editor.component.html',
  styleUrl: './rich-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'rich-editor',
    '[class.is-invalid]': 'invalid()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
})
export class RichEditorComponent implements ControlValueAccessor {
  readonly invalid     = input(false);
  readonly placeholder = input('');

  readonly modules = QUILL_MODULES;
  readonly control = new FormControl<string>('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.control.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.onChange(value ?? ''));
  }

  writeValue(value: string): void {
    this.control.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(disabled: boolean): void {
    disabled ? this.control.disable({ emitEvent: false }) : this.control.enable({ emitEvent: false });
  }

  markAsTouched(): void {
    this.onTouched();
  }
}
