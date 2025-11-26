export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  enableRegistration: boolean;
  enableComments: boolean;
  maintenanceMode: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSSL: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  priceAlerts: boolean;
  newUserRegistration: boolean;
  systemUpdates: boolean;
  dailyReports: boolean;
  alertThreshold: number;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupTime: string;
  keepBackups: number;
  backupEmail: string;
}

export interface SecuritySettings {
  requireStrongPassword: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  enable2FA: boolean;
  allowedIPs: string[];
  blockSuspiciousActivity: boolean;
}
