import { dataTestId } from '@percona/platform-core';
import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { dbClustersStub } from '../__mocks__/dbClustersStubs';

import { UpdateDBClusterModal } from './UpdateDBClusterModal';

jest.mock('../XtraDB.service');

describe('UpdateDBClusterModal::', () => {
  it('should render message with new database version', () => {
    const { container } = render(
      <UpdateDBClusterModal
        dbCluster={dbClustersStub[0]}
        isVisible
        setVisible={jest.fn()}
        setLoading={jest.fn()}
        onUpdateFinished={jest.fn()}
      />
    );
    const message = 'MySQL 5.6 to version 8.0 in dbcluster1';

    expect(container.querySelector(dataTestId('update-dbcluster-message'))?.textContent).toContain(message);
  });

  it('should call onUpdateFinished after update', async () => {
    const onUpdateFinished = jest.fn();
    const { container } = render(
      <UpdateDBClusterModal
        dbCluster={dbClustersStub[0]}
        isVisible
        setVisible={jest.fn()}
        setLoading={jest.fn()}
        onUpdateFinished={onUpdateFinished}
      />
    );

    const button = container.querySelector(dataTestId('confirm-update-dbcluster-button'));

    fireEvent.click(button!);

    await waitFor(() => expect(onUpdateFinished).toHaveBeenCalledTimes(1));
  });
});
