"use client";

import { useState, useEffect } from "react";
import {
  SystemSettings,
  EmailSettings,
  NotificationSettings,
  BackupSettings,
  SecuritySettings,
} from "@/app/types/settings";
import {
  getSystemSettings,
  updateSystemSettings,
  getEmailSettings,
  updateEmailSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getBackupSettings,
  updateBackupSettings,
  getSecuritySettings,
  updateSecuritySettings,
} from "@/app/lib/settings-api";
import { Save, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import Loading from "@/app/components/admin/Loading";
import { tabs } from "@/app/data/tabs";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("system");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(
    null
  );
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(
    null
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings | null>(null);
  const [backupSettings, setBackupSettings] = useState<BackupSettings | null>(
    null
  );
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [system, email, notification, backup, security] = await Promise.all(
        [
          getSystemSettings(),
          getEmailSettings(),
          getNotificationSettings(),
          getBackupSettings(),
          getSecuritySettings(),
        ]
      );
      setSystemSettings(system);
      setEmailSettings(email);
      setNotificationSettings(notification);
      setBackupSettings(backup);
      setSecuritySettings(security);
    } catch (error) {
      console.error("Error loading settings:", error);
      setMessage({ type: "error", text: "មិនអាចទាញយកការកំណត់បាន" });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsChange = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    if (systemSettings) {
      setSystemSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  const handleEmailSettingsChange = <K extends keyof EmailSettings>(
    key: K,
    value: EmailSettings[K]
  ) => {
    if (emailSettings) {
      setEmailSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  const handleNotificationSettingsChange = <
    K extends keyof NotificationSettings
  >(
    key: K,
    value: NotificationSettings[K]
  ) => {
    if (notificationSettings) {
      setNotificationSettings((prev) =>
        prev ? { ...prev, [key]: value } : null
      );
    }
  };

  const handleBackupSettingsChange = <K extends keyof BackupSettings>(
    key: K,
    value: BackupSettings[K]
  ) => {
    if (backupSettings) {
      setBackupSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  const handleSecuritySettingsChange = <K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K]
  ) => {
    if (securitySettings) {
      setSecuritySettings((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      switch (activeTab) {
        case "system":
          if (systemSettings) await updateSystemSettings(systemSettings);
          break;
        case "email":
          if (emailSettings) await updateEmailSettings(emailSettings);
          break;
        case "notifications":
          if (notificationSettings)
            await updateNotificationSettings(notificationSettings);
          break;
        case "backup":
          if (backupSettings) await updateBackupSettings(backupSettings);
          break;
        case "security":
          if (securitySettings) await updateSecuritySettings(securitySettings);
          break;
      }
      setMessage({
        type: "success",
        text: "ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "មិនអាចរក្សាទុកការកំណត់បាន" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            ការកំណត់ប្រព័ន្ធ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            គ្រប់គ្រងការកំណត់ប្រព័ន្ធ និងការរចនារបស់គេហទំព័រ
          </p>
        </div>

        <div className="flex xs:flex-row gap-3 justify-center sm:justify-end">
          <button
            onClick={loadSettings}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center font-khmer-content disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            អាប់ដេតទិន្នន័យ
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-khmer-content disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកការកំណត់"}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            )}
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              } font-khmer-content`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
            flex items-center px-4 lg:px-6 py-3 border-b-2 font-medium text-sm 
            whitespace-nowrap shrink-0 min-w-0
            transition-colors duration-200
            ${
              activeTab === tab.id
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            } font-khmer-content
          `}
              >
                <tab.icon className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
        {activeTab === "system" && systemSettings && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              ការកំណត់ប្រព័ន្ធទូទៅ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ឈ្មោះគេហទំព័រ
                </label>
                <input
                  title="inputSystemSettings"
                  type="text"
                  value={systemSettings.siteName}
                  onChange={(e) =>
                    handleSystemSettingsChange("siteName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  រូបិយប័ណ្ណ
                </label>
                <select
                  title="selectSystemSettings"
                  value={systemSettings.currency}
                  onChange={(e) =>
                    handleSystemSettingsChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                >
                  <option value="KHR">រៀល (KHR)</option>
                  <option value="USD">ដុល្លារ (USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ភាសា
                </label>
                <select
                  title="selectSystemSettings"
                  value={systemSettings.language}
                  onChange={(e) =>
                    handleSystemSettingsChange("language", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                >
                  <option value="km">ខ្មែរ</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  តំបន់ពេលវេលា
                </label>
                <select
                  title="selectSystemSettings"
                  value={systemSettings.timezone}
                  onChange={(e) =>
                    handleSystemSettingsChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                >
                  <option value="Asia/Phnom_Penh">ភ្នំពេញ (UTC+7)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ធាតុក្នុងមួយទំព័រ
                </label>
                <input
                  title="inputSystemSettings"
                  type="number"
                  value={systemSettings.itemsPerPage}
                  onChange={(e) =>
                    handleSystemSettingsChange(
                      "itemsPerPage",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="10"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableRegistration"
                  checked={systemSettings.enableRegistration}
                  onChange={(e) =>
                    handleSystemSettingsChange(
                      "enableRegistration",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="enableRegistration"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-khmer-content"
                >
                  អនុញ្ញាតឱ្យអ្នកប្រើប្រាស់ចុះឈ្មោះថ្មី
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) =>
                    handleSystemSettingsChange(
                      "maintenanceMode",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="maintenanceMode"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-khmer-content"
                >
                  របៀបថែទាំប្រព័ន្ធ
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "email" && emailSettings && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              ការកំណត់អ៊ីមែល
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  SMTP Host
                </label>
                <input
                  title="inputEmailSettings"
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpHost", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  SMTP Port
                </label>
                <input
                  title="inputEmailSettings"
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    handleEmailSettingsChange(
                      "smtpPort",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  អ្នកប្រើ SMTP
                </label>
                <input
                  title="inputEmailSettings"
                  type="text"
                  value={emailSettings.smtpUsername}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpUsername", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ពាក្យសម្ងាត់ SMTP
                </label>
                <input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpPassword", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  អ៊ីមែលផ្ញើ
                </label>
                <input
                  title="inputEmailSettings"
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    handleEmailSettingsChange("fromEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ឈ្មោះផ្ញើ
                </label>
                <input
                  title="inputEmailSettings"
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) =>
                    handleEmailSettingsChange("fromName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableSSL"
                checked={emailSettings.enableSSL}
                onChange={(e) =>
                  handleEmailSettingsChange("enableSSL", e.target.checked)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="enableSSL"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-khmer-content"
              >
                ប្រើ SSL/TLS
              </label>
            </div>
          </div>
        )}

        {activeTab === "notifications" && notificationSettings && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              ការកំណត់ការជូនដំណឹង
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ការជូនដំណឹងតាមអ៊ីមែល
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ការជូនដំណឹងតម្លៃ
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={notificationSettings.priceAlerts}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "priceAlerts",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ការជូនដំណឹងអ្នកប្រើប្រាស់ថ្មី
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={notificationSettings.newUserRegistration}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "newUserRegistration",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ការជូនដំណឹងអាប់ដេតប្រព័ន្ធ
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={notificationSettings.systemUpdates}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "systemUpdates",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  របាយការណ៍ប្រចាំថ្ងៃ
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={notificationSettings.dailyReports}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "dailyReports",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  កម្រិតជូនដំណឹងតម្លៃ (% ផ្លាស់ប្តូរ)
                </label>
                <input
                  title="inputNotificationSettings"
                  type="number"
                  value={notificationSettings.alertThreshold}
                  onChange={(e) =>
                    handleNotificationSettingsChange(
                      "alertThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "backup" && backupSettings && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              ការកំណត់បម្រុងទុក
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  បម្រុងទុកស្វ័យប្រវត្តិ
                </label>
                <input
                  title="inputNotificationSettings"
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) =>
                    handleBackupSettingsChange("autoBackup", e.target.checked)
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ភាពញឹកញាប់បម្រុងទុក
                </label>
                <select
                  title="inputNotificationSettings"
                  value={backupSettings.backupFrequency}
                  onChange={(e) =>
                    handleBackupSettingsChange(
                      "backupFrequency",
                      e.target.value as "daily" | "weekly" | "monthly"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                >
                  <option value="daily">ប្រចាំថ្ងៃ</option>
                  <option value="weekly">ប្រចាំសប្តាហ៍</option>
                  <option value="monthly">ប្រចាំខែ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ពេលវេលាបម្រុងទុក
                </label>
                <input
                  title="inputBackupSettings"
                  type="time"
                  value={backupSettings.backupTime}
                  onChange={(e) =>
                    handleBackupSettingsChange("backupTime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  រក្សាទុកបម្រុងទុក (ថ្ងៃ)
                </label>
                <input
                  title="inputBackupSettings"
                  type="number"
                  value={backupSettings.keepBackups}
                  onChange={(e) =>
                    handleBackupSettingsChange(
                      "keepBackups",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  អ៊ីមែលទទួលបម្រុងទុក
                </label>
                <input
                  title="inputBackupSettings"
                  type="email"
                  value={backupSettings.backupEmail}
                  onChange={(e) =>
                    handleBackupSettingsChange("backupEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && securitySettings && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              ការកំណត់សុវត្ថិភាព
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  តម្រូវឱ្យមានពាក្យសម្ងាត់ខ្លាំង
                </label>
                <input
                  title="inputSecuritySettings"
                  type="checkbox"
                  checked={securitySettings.requireStrongPassword}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "requireStrongPassword",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ភាពយន្តសុវត្ថិភាព ២ ជំហាន
                </label>
                <input
                  title="inputSecuritySettings"
                  type="checkbox"
                  checked={securitySettings.enable2FA}
                  onChange={(e) =>
                    handleSecuritySettingsChange("enable2FA", e.target.checked)
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-khmer-content">
                  ទប់ស្កាត់សកម្មភាពស verdachte
                </label>
                <input
                  title="inputSecuritySettings"
                  type="checkbox"
                  checked={securitySettings.blockSuspiciousActivity}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "blockSuspiciousActivity",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ចំនួនការប៉ុនប៉ងចូលអតិបរមា
                </label>
                <input
                  title="inputSecuritySettings"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "maxLoginAttempts",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ពេលវេលាផុតកំណត់សេស្សិន (នាទី)
                </label>
                <input
                  title="inputSecuritySettings"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="15"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  IP ដែលអនុញ្ញាត (មួយក្នុងមួយជួរ)
                </label>
                <textarea
                  value={securitySettings.allowedIPs.join("\n")}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "allowedIPs",
                      e.target.value.split("\n")
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-khmer-content">
                  ទុកទទេដើម្បីអនុញ្ញាតគ្រប់ IP
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
