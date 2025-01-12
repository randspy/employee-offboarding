import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffboardingDialogComponent } from './offboarding-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonHarness } from '@angular/material/button/testing';
import { UsersStore } from '../../stores/users.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockLoggerService } from '../../../../../tests/mock-logger-service';
import { LoggerService } from '../../../../core/errors/services/logger.service';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';

describe('OffboardingDialogComponent', () => {
  let component: OffboardingDialogComponent;
  let fixture: ComponentFixture<OffboardingDialogComponent>;
  let loader: HarnessLoader;
  let dialogRef: jest.Mocked<MatDialogRef<OffboardingDialogComponent>>;
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
    } as Partial<MatDialogRef<OffboardingDialogComponent>> as jest.Mocked<
      MatDialogRef<OffboardingDialogComponent>
    >;

    await TestBed.configureTestingModule({
      imports: [OffboardingDialogComponent, NoopAnimationsModule],
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

    fixture = TestBed.createComponent(OffboardingDialogComponent);
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

  it('should close dialog with form value when submitted', async () => {
    await fillFormWithValidData();

    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );
    await submitButton.click();

    expect(mockUsersStore.offboardEmployee).toHaveBeenCalledWith(
      {
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
      },
      expect.anything(),
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show submit button when offboarding is failed', async () => {
    isError.set(true);
    await fillFormWithValidData();

    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );

    await submitButton.click();

    expect(await submitButton.isDisabled()).toBe(false);
  });

  it('should show loading button when offboarding is in progress', async () => {
    isLoading.set(true);
    fixture.detectChanges();

    const loaderComponent = fixture.debugElement.query(
      By.directive(LoaderComponent),
    );
    expect(loaderComponent).toBeTruthy();
  });

  it('should show saved button when offboarding is successful', async () => {
    await fillFormWithValidData();

    const submitButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Submit' }),
    );
    await submitButton.click();

    const savedButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Saved' }),
    );

    expect(await savedButton.isDisabled()).toBe(true);
  });

  const fillFormWithValidData = async () => {
    const inputs = {
      email: 'test@example.com',
      phone: '+48 123 456 789',
      receiver: 'John Doe',
      country: 'Poland',
      city: 'Warsaw',
      streetLine1: 'Test Street 1',
      postalCode: '00-123',
      notes: 'Test notes',
    };

    for (const [field, value] of Object.entries(inputs)) {
      await setInputValue(field, value);
    }
  };

  const setInputValue = async (fieldPath: string, value: string) => {
    const input = await loader.getHarness(
      MatInputHarness.with({
        selector: `[formControlName="${fieldPath}"]`,
      }),
    );
    await input.setValue(value);
    await input.blur();
  };
});
