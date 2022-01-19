import { cx } from '@emotion/css';
import React, { FC, useMemo } from 'react';

import { useStyles2 } from '@grafana/ui';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';

import { STATUS_DATA_QA } from './KubernetesClusterStatus.constants';
import { getStyles } from './KubernetesClusterStatus.styles';
import { KubernetesClusterStatus as Status, KubernetesClusterStatusProps } from './KubernetesClusterStatus.types';

export const KubernetesClusterStatus: FC<KubernetesClusterStatusProps> = ({ status }) => {
  const styles = useStyles2(getStyles);
  const statusStyles = useMemo(
    () => ({
      [styles.statusActive]: status === Status.ok,
      [styles.statusFailed]: status === Status.invalid,
      [styles.statusUnavailable]: status === Status.unavailable,
    }),
    [status, styles.statusActive, styles.statusFailed, styles.statusUnavailable]
  );

  return (
    <div className={styles.clusterStatusWrapper}>
      <span className={cx(styles.status, statusStyles)} data-testid={`cluster-status-${STATUS_DATA_QA[status]}`}>
        {Messages.kubernetes.kubernetesStatus[status]}
      </span>
    </div>
  );
};
