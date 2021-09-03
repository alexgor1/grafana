import { cx } from 'emotion';
import React, { FC, useMemo } from 'react';

import { useTheme } from '@grafana/ui';
import { Ellipsis } from 'app/percona/shared/components/Elements/Icons';

import { BackupStatus, RestoreStatus } from '../../Backup.types';
import { formatStatus } from '../../Backup.utils';

import { getStyles } from './Status.styles';
import { StatusProps } from './Status.types';

const pendingStates = [
  BackupStatus.BACKUP_STATUS_PENDING,
  BackupStatus.BACKUP_STATUS_IN_PROGRESS,
  RestoreStatus.RESTORE_STATUS_IN_PROGRESS,
];

const successfulStates = [BackupStatus.BACKUP_STATUS_SUCCESS, RestoreStatus.RESTORE_STATUS_SUCCESS];
const errorStates = [
  BackupStatus.BACKUP_STATUS_ERROR,
  RestoreStatus.RESTORE_STATUS_ERROR,
  BackupStatus.BACKUP_STATUS_INVALID,
  RestoreStatus.RESTORE_STATUS_INVALID,
];

export const Status: FC<StatusProps> = ({ status }) => {
  const statusMsg = formatStatus(status);
  const theme = useTheme();
  const styles = getStyles(theme);
  const statusStyles = useMemo(
    () => ({
      [styles.statusSuccess]: successfulStates.includes(status),
      [styles.statusError]: errorStates.includes(status),
    }),
    [status, styles.statusError, styles.statusSuccess]
  );
  const isPending = pendingStates.includes(status);

  return isPending ? (
    <span data-qa="statusPending" className={styles.ellipsisContainer}>
      <Ellipsis />
    </span>
  ) : (
    <span data-qa="statusMsg" className={cx(statusStyles)}>
      {statusMsg}
    </span>
  );
};
