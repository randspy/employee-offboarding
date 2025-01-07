import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffboardDialogComponent } from './offboard-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { UsersStore } from '../../stores/users.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockLoggerService } from '../../../../../tests/mock-logger-service';
import { LoggerService } from '../../../../core/errors/services/logger.service';
import { signal, WritableSignal } from '@angular/core';

describe('OffboardDialogComponent', () => {
  let component: OffboardDialogComponent;
  let fixture: ComponentFixture<OffboardDialogComponent>;
  let loader: HarnessLoader;
  let dialogRef: jest.Mocked<MatDialogRef<OffboardDialogComponent>>;
  let isLoading: WritableSignal<boolean>;
  let isError: WritableSignal<boolean>;
  let error: WritableSignal<string>;
  let mockUsersStore: jest.Mocked<UsersStore>;

  beforeEach(async () => {
    isLoading = signal(false);
    isError = signal(false);
    error = signal('');

    mockUsersStore = {
      isLoading,
      isError,
      error,
      offboardEmployee: jest.fn(),
    } as unknown as jest.Mocked<UsersStore>;

    dialogRef = {
      close: jest.fn(),
    } as Partial<MatDialogRef<OffboardDialogComponent>> as jest.Mocked<
      MatDialogRef<OffboardDialogComponent>
    >;

    await TestBed.configureTestingModule({
      imports: [OffboardDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 'test-id' },
        },
        {
          provide: UsersStore,
          useValue: mockUsersStore,
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardDialogComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button when form is invalid', async () => {
    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );

    expect(await submitButton.isDisabled()).toBe(true);
  });

  it('should enable submit button when form is valid', async () => {
    await fillFormWithValidData();

    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );

    expect(await submitButton.isDisabled()).toBe(false);
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

  it('should close dialog with form value when submitted', async () => {
    await fillFormWithValidData();

    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );
    await submitButton.click();

    expect(mockUsersStore.offboardEmployee).toHaveBeenCalledWith({
      id: 'test-id',
      offboarding: {
        email: 'test@example.com',
        phone: '+48 123 456 789',
        address: {
          receiver: 'John Doe',
          country: 'Poland',
          city: 'Warsaw',
          streetLine1: 'Test Street 1',
          postalCode: '00-123',
        },
        notes: 'Test notes',
      },
    });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show error message when offboarding fails', async () => {
    isError.set(true);
    error.set('Error message');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Error: Error message');
    expect(fixture.nativeElement.textContent).not.toContain('Loading');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  const fillFormWithValidData = async () => {
    const inputs = {
      email: 'test@example.com',
      phone: '+48 123 456 789',
      'address.receiver': 'John Doe',
      'address.country': 'Poland',
      'address.city': 'Warsaw',
      'address.streetLine1': 'Test Street 1',
      'address.postalCode': '00-123',
      notes: 'Test notes',
    };

    for (const [field, value] of Object.entries(inputs)) {
      await setInputValue(field, value);
    }
  };

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
