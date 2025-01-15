import { Provider } from '@angular/core';
import { NotificationService } from '../app/core/shared/services/notification.service';

export const mockNotificationService: jest.Mocked<NotificationService> = {
  showError: jest.fn(),
} as Partial<NotificationService> as jest.Mocked<NotificationService>;

export function provideMockNotificationService(): Provider {
  return {
    provide: NotificationService,
    useValue: mockNotificationService,
  };
}
