import {
  BackupSettings,
  EmailSettings,
  NotificationSettings,
  SecuritySettings,
  SystemSettings,
} from "../types/settings";

const mockSystemSettings: SystemSettings = {
  siteName: "តារាងតម្លៃផលិតផលកសិកម្ម",
  siteDescription: "កម្មវិធីតាមដានតម្លៃផលិតផលកសិកម្មនៅទីផ្សារផ្សេងៗ",
  currency: "KHR",
  language: "km",
  timezone: "Asia/Phnom_Penh",
  dateFormat: "dd/MM/yyyy",
  itemsPerPage: 50,
  enableRegistration: true,
  enableComments: false,
  maintenanceMode: false,
};

const mockEmailSettings: EmailSettings = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUsername: "noreply@agriprice.gov.kh",
  smtpPassword: "",
  fromEmail: "noreply@agriprice.gov.kh",
  fromName: "Agricultural Market Price",
  enableSSL: true,
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  priceAlerts: true,
  newUserRegistration: true,
  systemUpdates: true,
  dailyReports: false,
  alertThreshold: 20,
};

const mockBackupSettings: BackupSettings = {
  autoBackup: true,
  backupFrequency: "daily",
  backupTime: "02:00",
  keepBackups: 30,
  backupEmail: "admin@agriprice.gov.kh",
};

const mockSecuritySettings: SecuritySettings = {
  requireStrongPassword: true,
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  enable2FA: false,
  allowedIPs: ["192.168.1.0/24", "10.0.0.0/8"],
  blockSuspiciousActivity: true,
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSystemSettings;
  } catch (error) {
    console.error("Error fetching system settings:", error);
    throw new Error("Failed to fetch system settings");
  }
}

export async function updateSystemSettings(
  settings: SystemSettings
): Promise<SystemSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating system settings:", settings);
    return settings;
  } catch (error) {
    console.error("Error updating system settings:", error);
    throw new Error("Failed to update system settings");
  }
}

export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockEmailSettings;
  } catch (error) {
    console.error("Error fetching email settings:", error);
    throw new Error("Failed to fetch email settings");
  }
}

export async function updateEmailSettings(
  settings: EmailSettings
): Promise<EmailSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating email settings:", settings);
    return settings;
  } catch (error) {
    console.error("Error updating email settings:", error);
    throw new Error("Failed to update email settings");
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockNotificationSettings;
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    throw new Error("Failed to fetch notification settings");
  }
}

export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<NotificationSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating notification settings:", settings);
    return settings;
  } catch (error) {
    console.error("Error updating notification settings:", error);
    throw new Error("Failed to update notification settings");
  }
}

export async function getBackupSettings(): Promise<BackupSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockBackupSettings;
  } catch (error) {
    console.error("Error fetching backup settings:", error);
    throw new Error("Failed to fetch backup settings");
  }
}

export async function updateBackupSettings(
  settings: BackupSettings
): Promise<BackupSettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating backup settings:", settings);
    return settings;
  } catch (error) {
    console.error("Error updating backup settings:", error);
    throw new Error("Failed to update backup settings");
  }
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSecuritySettings;
  } catch (error) {
    console.error("Error fetching security settings:", error);
    throw new Error("Failed to fetch security settings");
  }
}

export async function updateSecuritySettings(
  settings: SecuritySettings
): Promise<SecuritySettings> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating security settings:", settings);
    return settings;
  } catch (error) {
    console.error("Error updating security settings:", error);
    throw new Error("Failed to update security settings");
  }
}
