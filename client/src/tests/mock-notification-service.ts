import { NotificationService } from '../app/core/shared/services/notification.service';

export const mockNotificationService: jest.Mocked<NotificationService> = {
  showError: jest.fn(),
} as Partial<NotificationService> as jest.Mocked<NotificationService>;
