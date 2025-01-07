import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffboardingEmployeeListComponent } from './offboarding-employee-list.component';
import { By } from '@angular/platform-browser';

import { generateEmployee } from '../../../../../tests/test-object-generators';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { provideRouter } from '@angular/router';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';

describe('OffboardingEmployeeListComponent', () => {
  let component: OffboardingEmployeeListComponent;
  let fixture: ComponentFixture<OffboardingEmployeeListComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingEmployeeListComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingEmployeeListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('employees', []);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee data', () => {
    fixture.componentRef.setInput('employees', [
      generateEmployee({
        id: 'employee-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        equipments: [
          {
            id: 'equipment-1',
            name: 'Laptop',
          },
        ],
      }),
    ]);

    fixture.detectChanges();

    expect(getNameText(0)).toBe('John Doe');
    expect(getEmailText(0)).toBe('john.doe@example.com');
    expect(getDepartmentText(0)).toBe('Engineering');
    expect(getEquipmentText(0)).toBe('Laptop');
    expect(getStatusText(0)).toBe('ACTIVE');
  });

  it('should combine equipment names', () => {
    const equipments = [
      { id: 'equipment-1', name: 'Laptop' },
      { id: 'equipment-2', name: 'Mouse' },
    ];
    expect(component.getEquipmentNames(equipments)).toBe('Laptop, Mouse');
  });

  it('should paginate to the next page', async () => {
    fixture.componentRef.setInput('employees', [
      generateEmployee({ id: 'employee-1', name: 'John Doe' }),
      generateEmployee({ id: 'employee-2', name: 'Jane Doe' }),
      generateEmployee({ id: 'employee-3', name: 'Alice Doe' }),
      generateEmployee({ id: 'employee-4', name: 'Bob Doe' }),
      generateEmployee({ id: 'employee-5', name: 'Charlie Doe' }),
      generateEmployee({ id: 'employee-6', name: 'David Doe' }),
      generateEmployee({ id: 'employee-7', name: 'Eve Doe' }),
      generateEmployee({ id: 'employee-8', name: 'Frank Doe' }),
      generateEmployee({ id: 'employee-9', name: 'Grace Doe' }),
      generateEmployee({ id: 'employee-10', name: 'Hank Doe' }),
      generateEmployee({ id: 'employee-11', name: 'Ivy Doe' }),
    ]);

    fixture.detectChanges();

    const paginator = await loader.getHarness(MatPaginatorHarness);
    await paginator.goToNextPage();

    fixture.detectChanges();

    expect(numberOfRows()).toBe(1);
    expect(getNameText(0)).toBe('Ivy Doe');
  });

  it('should have a link to employee detail page', async () => {
    fixture.componentRef.setInput('employees', [
      generateEmployee({ id: 'employee-1' }),
    ]);

    fixture.detectChanges();

    const viewLink = fixture.debugElement.query(By.css('a'));

    expect(viewLink.nativeElement.textContent).toContain('View');
    expect(
      viewLink.nativeElement.attributes.getNamedItem('ng-reflect-router-link')
        .value,
    ).toContain('employee-1');
  });

  const getNameText = (index: number) => getCellText(index, 'name');
  const getEmailText = (index: number) => getCellText(index, 'email');
  const getDepartmentText = (index: number) => getCellText(index, 'department');
  const getEquipmentText = (index: number) => getCellText(index, 'equipment');
  const getStatusText = (index: number) => getCellText(index, 'status');

  const getCellText = (index: number, dataLabel: string) => {
    const cells = fixture.debugElement.queryAll(
      By.css(`[data-label="${dataLabel}"]`),
    );
    return cells[index]?.nativeElement.textContent.trim();
  };

  const numberOfRows = () => {
    return fixture.debugElement.queryAll(By.css('[data-label="name"]')).length;
  };
});
