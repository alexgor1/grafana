/* eslint-disable react/display-name */
import { logger } from '@percona/platform-core';
import { CancelToken } from 'axios';
import React, { FC, useMemo, useState, useEffect, useCallback } from 'react';
import { Column, Row } from 'react-table';

import { Button, useStyles } from '@grafana/ui';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DeleteModal } from 'app/percona/shared/components/Elements/DeleteModal';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell/ExpandableCell';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { isApiCancelError } from 'app/percona/shared/helpers/api';

import { Messages } from '../../Backup.messages';
import { RetryMode } from '../../Backup.types';
import { formatBackupMode } from '../../Backup.utils';
import { useRecurringCall } from '../../hooks/recurringCall.hook';
import { AddBackupModal } from '../AddBackupModal';
import { AddBackupFormProps } from '../AddBackupModal/AddBackupModal.types';
import { DetailedDate } from '../DetailedDate';
import { Status } from '../Status';

import {
  BACKUP_CANCEL_TOKEN,
  LIST_ARTIFACTS_CANCEL_TOKEN,
  RESTORE_CANCEL_TOKEN,
  DATA_INTERVAL,
} from './BackupInventory.constants';
import { BackupInventoryService } from './BackupInventory.service';
import { Backup } from './BackupInventory.types';
import { BackupInventoryActions } from './BackupInventoryActions';
import { BackupInventoryDetails } from './BackupInventoryDetails';
import { BackupLogsModal } from './BackupLogsModal/BackupLogsModal';
import { RestoreBackupModal } from './RestoreBackupModal';

export const BackupInventory: FC = () => {
  const [pending, setPending] = useState(true);
  const [deletePending, setDeletePending] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [data, setData] = useState<Backup[]>([]);
  const [triggerTimeout] = useRecurringCall();
  const [generateToken] = useCancelToken();
  const columns = useMemo(
    (): Array<Column<Backup>> => [
      {
        Header: Messages.backupInventory.table.columns.name,
        accessor: 'name',
        id: 'name',
        width: '250px',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: Messages.backupInventory.table.columns.vendor,
        accessor: ({ vendor }: Backup) => DATABASE_LABELS[vendor],
        width: '150px',
      },
      {
        Header: Messages.backupInventory.table.columns.created,
        accessor: 'created',
        Cell: ({ value }) => <DetailedDate date={value} />,
      },
      {
        Header: Messages.backupInventory.table.columns.type,
        accessor: 'mode',
        Cell: ({ value }) => formatBackupMode(value),
      },
      {
        Header: Messages.backupInventory.table.columns.location,
        accessor: 'locationName',
      },
      {
        Header: Messages.backupInventory.table.columns.status,
        accessor: 'status',
        Cell: ({ value, row }) => (
          <Status
            showLogsAction={row.original.vendor === Databases.mongodb}
            status={value}
            onLogClick={() => onLogClick(row.original)}
          />
        ),
      },
      {
        Header: Messages.backupInventory.table.columns.actions,
        accessor: 'id',
        Cell: ({ row }) => (
          <BackupInventoryActions
            onRestore={onRestoreClick}
            onBackup={onBackupClick}
            backup={row.original}
            onDelete={onDeleteClick}
          />
        ),
        width: '150px',
      },
    ],
    []
  );
  const styles = useStyles(getStyles);

  const onRestoreClick = (backup: Backup) => {
    setSelectedBackup(backup);
    setRestoreModalVisible(true);
  };

  const onDeleteClick = (backup: Backup) => {
    setSelectedBackup(backup);
    setDeleteModalVisible(true);
  };

  const onLogClick = (backup: Backup) => {
    setSelectedBackup(backup);
    setLogsModalVisible(true);
  };

  const handleClose = () => {
    setSelectedBackup(null);
    setRestoreModalVisible(false);
    setBackupModalVisible(false);
  };

  const handleLogsClose = () => {
    setSelectedBackup(null);
    setLogsModalVisible(false);
  };

  const handleRestore = async (serviceId: string, artifactId: string) => {
    try {
      await BackupInventoryService.restore(serviceId, artifactId, generateToken(RESTORE_CANCEL_TOKEN));
      setRestoreModalVisible(false);
    } catch (e) {
      logger.error(e);
    }
  };

  const getData = useCallback(
    async (showLoading = false) => {
      showLoading && setPending(true);

      try {
        const backups = await BackupInventoryService.list(generateToken(LIST_ARTIFACTS_CANCEL_TOKEN));
        setData(backups);
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
      setPending(false);
    },
    [generateToken]
  );

  const handleDelete = useCallback(
    async (force = false) => {
      try {
        await BackupInventoryService.delete(selectedBackup!.id, force);
        setDeleteModalVisible(false);
        setSelectedBackup(null);
        getData(true);
      } catch (e) {
        logger.error(e);
      } finally {
        setDeletePending(false);
      }
    },
    [getData, selectedBackup]
  );

  const getLogs = async (startingChunk: number, offset: number, token?: CancelToken) => {
    return BackupInventoryService.getLogs(selectedBackup!.id, startingChunk, offset, token);
  };

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Backup>) => (
      <BackupInventoryDetails
        name={row.original.name}
        status={row.original.status}
        dataModel={row.original.dataModel}
      />
    ),
    []
  );

  const onBackupClick = (backup: Backup | null) => {
    setSelectedBackup(backup);
    setBackupModalVisible(true);
  };

  const handleBackup = async ({
    service,
    location,
    backupName,
    description,
    retryMode,
    retryInterval,
    retryTimes,
  }: AddBackupFormProps) => {
    const strRetryInterval = `${retryInterval}s`;
    let resultRetryTimes = retryMode === RetryMode.MANUAL ? 0 : retryTimes;
    try {
      await BackupInventoryService.backup(
        service!.value?.id || '',
        location!.value || '',
        backupName,
        description,
        strRetryInterval,
        resultRetryTimes!,
        generateToken(BACKUP_CANCEL_TOKEN)
      );
      setBackupModalVisible(false);
      setSelectedBackup(null);
      getData(true);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
  };

  useEffect(() => {
    getData(true).then(() => triggerTimeout(getData, DATA_INTERVAL));
  }, [getData, triggerTimeout]);

  return (
    <>
      <div className={styles.addWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          data-testid="backup-add-modal-button"
          onClick={() => onBackupClick(null)}
        >
          {Messages.add}
        </Button>
      </div>
      <Table
        data={data}
        totalItems={data.length}
        columns={columns}
        emptyMessage={Messages.backupInventory.table.noData}
        pendingRequest={pending}
        autoResetExpanded={false}
        renderExpandedRow={renderSelectedSubRow}
      ></Table>
      {restoreModalVisible && (
        <RestoreBackupModal
          backup={selectedBackup}
          isVisible
          onClose={handleClose}
          onRestore={handleRestore}
          noService={!selectedBackup?.serviceId || !selectedBackup?.serviceName}
        />
      )}
      {backupModalVisible && (
        <AddBackupModal backup={selectedBackup} isVisible onClose={handleClose} onBackup={handleBackup} />
      )}
      {deleteModalVisible && (
        <DeleteModal
          title={Messages.backupInventory.deleteModalTitle}
          message={Messages.backupInventory.getDeleteMessage(selectedBackup?.name || '')}
          isVisible
          setVisible={setDeleteModalVisible}
          forceLabel={Messages.backupInventory.deleteFromStorage}
          onDelete={handleDelete}
          initialForceValue={true}
          loading={deletePending}
          showForce
        />
      )}
      {logsModalVisible && (
        <BackupLogsModal
          title={Messages.backupInventory.getLogsTitle(selectedBackup?.name || '')}
          isVisible
          onClose={handleLogsClose}
          getLogChunks={getLogs}
        />
      )}
    </>
  );
};
