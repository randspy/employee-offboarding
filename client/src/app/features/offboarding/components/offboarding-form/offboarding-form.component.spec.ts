import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingFormComponent } from './offboarding-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('OffboardingFormComponent', () => {
  let component: OffboardingFormComponent;
  let fixture: ComponentFixture<OffboardingFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    ['email', '', 'Email is required'],
    ['email', 'invalid-email', 'Please enter a valid email address'],
    ['phone', '', 'Phone number is required'],
    ['phone', '123', 'Please enter a valid phone number (+48 XXX XXX XXX)'],
    ['address.receiver', '', 'Receiver name is required'],
    ['address.country', '', 'Country is required'],
    ['address.city', '', 'City is required'],
    ['address.streetLine1', '', 'Street address is required'],
    ['address.postalCode', '', 'Postal code is required'],
    ['address.postalCode', '123', 'Please enter a valid postal code (XX-XXX)'],
  ])(
    'should show validation error for %s: %s -> %s',
    async (field, value, expectedError) => {
      await setInputValue(field, value);
      expect(await getErrorMessage(field)).toBe(expectedError);
    },
  );

  const getErrorMessage = async (fieldPath: string): Promise<string> => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);

    for (const formField of formFields) {
      const input = (await formField.getControl()) as MatInputHarness;
      const inputEl = await input.host();
      const controlName = await inputEl.getAttribute('formcontrolname');

      if (fieldPath.includes('.')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, control] = fieldPath.split('.');
        if (controlName === control) {
          const errors = await formField.getTextErrors();
          return errors[0] ?? '';
        }
      } else if (controlName === fieldPath) {
        const errors = await formField.getTextErrors();
        return errors[0] ?? '';
      }
    }

    return '';
  };

  const setInputValue = async (fieldPath: string, value: string) => {
    const input = await loader.getHarness(
      MatInputHarness.with({
        selector: fieldPath.includes('.')
          ? `[formGroupName="address"] [formControlName="${fieldPath.split('.')[1]}"]`
          : `[formControlName="${fieldPath}"]`,
      }),
    );
    await input.setValue(value);
    await input.blur();
  };
});
