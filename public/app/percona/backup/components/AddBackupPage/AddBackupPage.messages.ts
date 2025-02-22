export const Messages = {
  serviceName: 'Service name',
  vendor: 'DB technology',
  dataModel: 'Data model',
  type: 'Backup type',
  databases: 'Databases',
  backupName: 'Backup name',
  description: 'Description',
  location: 'Location',
  retryMode: 'Retry mode',
  cancelAction: 'Cancel',
  retryTimes: 'Retry, times',
  retryInterval: 'Retry interval, seconds',
  every: 'Every',
  startTimeHour: 'Start time (hour)',
  startTimeMinute: 'Start time (minute)',
  advanceSettings: 'Advanced Settings:',
  fullLogs: 'Full logs',
  enabled: 'Enabled',
  retention: 'Retention (Number of backups - 0 for unlimited)',
  scheduleSection: 'UTC time',
  backupInfo: 'Backup info',
  onDemand: 'On Demand',
  schedule: 'Schedule Backup',
  scheduleName: 'Schedule',
  getModalTitle: (scheduleMode: boolean, edit: boolean) => {
    if (scheduleMode) {
      return edit ? 'Edit Scheduled backup' : 'Create Scheduled backup';
    }

    return 'Create Backup on demand';
  },
  getSubmitButtonText: (scheduleMode: boolean, edit: boolean) => {
    if (scheduleMode) {
      return edit ? 'Edit' : 'Schedule';
    }

    return 'Backup';
  },
  backupDescription: 'Create a backup of a database immediately, to store a snapshot of its current state and data.',
  scheduleBackupDescription:
    'Create a task that takes regular backups of a database, according to the schedule that you specify.',
};
