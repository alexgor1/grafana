import { dataQa } from '@percona/platform-core';
import { mount } from 'enzyme';
import React from 'react';
import { Form, FormRenderProps } from 'react-final-form';

import { Messages } from '../../../../DBaaS.messages';
import { kubernetesStub } from '../../../Kubernetes/__mocks__/kubernetesStubs';
import { AddDBClusterFields } from '../AddDBClusterModal.types';

import { DBClusterBasicOptions } from './DBClusterBasicOptions';
import { kubernetesClusterNameValidator } from './DBClusterBasicOptions.utils';

describe('DBClusterBasicOptions::', () => {
  it('renders correctly', () => {
    const root = mount(
      <Form
        onSubmit={jest.fn()}
        render={({ form }: FormRenderProps) => <DBClusterBasicOptions kubernetes={kubernetesStub} form={form} />}
      />
    );
    const databaseVersionField = root.find(dataQa('dbcluster-database-version-field'));

    expect(root.find(dataQa('name-text-input'))).toBeTruthy();
    expect(root.find(dataQa('dbcluster-kubernetes-cluster-field'))).toBeTruthy();
    expect(root.find(dataQa('dbcluster-database-type-field'))).toBeTruthy();
    expect(databaseVersionField).toBeTruthy();
    expect(databaseVersionField.find('input').prop('disabled')).toBeTruthy();
  });
  it('renders correctly with default values', () => {
    const root = mount(
      <Form
        initialValues={{
          [AddDBClusterFields.name]: 'dbcluster',
        }}
        onSubmit={jest.fn()}
        render={({ form }: FormRenderProps) => <DBClusterBasicOptions kubernetes={kubernetesStub} form={form} />}
      />
    );
    const name = root.find(dataQa('name-text-input'));

    expect(name.prop('value')).toEqual('dbcluster');
  });

  it('should validate cluster name correctly', () => {
    const clusterName1 = '!!!!';
    const clusterName2 = '1bcd';
    const clusterName3 = 'abcd';

    expect(kubernetesClusterNameValidator(clusterName1)).toEqual(
      Messages.dbcluster.addModal.validationMessages.clusterName
    );
    expect(kubernetesClusterNameValidator(clusterName2)).toEqual(
      Messages.dbcluster.addModal.validationMessages.clusterName
    );
    expect(kubernetesClusterNameValidator(clusterName3)).toEqual(undefined);
  });

  it('should validate cluster name length', () => {
    const root = mount(
      <Form
        initialValues={{
          [AddDBClusterFields.name]: 'testname',
        }}
        onSubmit={jest.fn()}
        render={({ form }: FormRenderProps) => <DBClusterBasicOptions kubernetes={kubernetesStub} form={form} />}
      />
    );

    root.find(dataQa('name-text-input')).simulate('change', {
      target: {
        value: 'testinvalidnamelength',
      },
    });

    expect(root.find(dataQa('name-field-error-message')).text().length).toBeGreaterThan(0);
  });
});
