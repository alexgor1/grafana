import { LoaderButton } from '@percona/platform-core';
import React, { FC, useState } from 'react';

import { IconButton, useStyles } from '@grafana/ui';
import { CheckService } from 'app/percona/check/Check.service';
import { Interval } from 'app/percona/check/types';

import { Messages } from './AllChecksTab.messages';
import { ChangeCheckIntervalModal } from './ChangeCheckIntervalModal';
import { getStyles } from './CheckTableRow.styles';
import { CheckTableRowProps } from './types';

const formatInterval = (interval: keyof typeof Interval): Interval => Interval[interval];

export const CheckTableRow: FC<CheckTableRowProps> = ({ check, onSuccess }) => {
  const styles = useStyles(getStyles);
  const [changeCheckPending, setChangeCheckPending] = useState(false);
  const [checkIntervalModalVisible, setCheckIntervalModalVisible] = useState(false);
  const { name, summary, description, disabled, interval } = check;

  const handleChangeCheckInterval = () => {
    setCheckIntervalModalVisible(true);
  };

  const changeCheck = async () => {
    setChangeCheckPending(true);
    const action = disabled ? 'enable' : 'disable';

    try {
      await CheckService.changeCheck({ params: [{ name, [action]: true }] });

      onSuccess({ ...check, disabled: !disabled });
    } catch (e) {
      console.error(e);
    } finally {
      setChangeCheckPending(false);
    }
  };

  return (
    <>
      <tr key={name}>
        <td>{summary}</td>
        <td>{description}</td>
        <td>{disabled ? Messages.disabled : Messages.enabled}</td>
        <td>{formatInterval(interval)}</td>
        <td>
          <div className={styles.actionsWrapper}>
            <LoaderButton
              variant={disabled ? 'primary' : 'destructive'}
              size="sm"
              loading={changeCheckPending}
              onClick={changeCheck}
              data-testid="check-table-loader-button"
            >
              {disabled ? Messages.enable : Messages.disable}
            </LoaderButton>
            <IconButton title={Messages.changeIntervalButtonTitle} name="pen" onClick={handleChangeCheckInterval} />
          </div>
        </td>
      </tr>
      <ChangeCheckIntervalModal
        isVisible={checkIntervalModalVisible}
        setVisible={setCheckIntervalModalVisible}
        check={check}
      />
    </>
  );
};
