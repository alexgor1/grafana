import React, { FC, useMemo } from 'react';

import { useStyles } from '@grafana/ui';

import { FeatureLoader } from '../shared/components/Elements/FeatureLoader';
import { TabbedContent, ContentTab } from '../shared/components/Elements/TabbedContent';
import { TechnicalPreview } from '../shared/components/Elements/TechnicalPreview/TechnicalPreview';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';

import { PAGE_MODEL } from './DBaaS.constants';
import { Messages } from './DBaaS.messages';
import { getStyles } from './DBaaS.styles';
import { TabKeys } from './DBaaS.types';
import { DBCluster } from './components/DBCluster/DBCluster';
import { useKubernetes } from './components/Kubernetes/Kubernetes.hooks';
import { isKubernetesListUnavailable } from './components/Kubernetes/Kubernetes.utils';
import { KubernetesInventory } from './components/Kubernetes/KubernetesInventory';

export const DBaaS: FC = () => {
  const styles = useStyles(getStyles);
  const { path: basePath } = PAGE_MODEL;

  const [kubernetes, deleteKubernetes, addKubernetes, kubernetesLoading] = useKubernetes();
  const tabs: ContentTab[] = useMemo(
    (): ContentTab[] => [
      {
        label: Messages.tabs.kubernetes,
        key: TabKeys.kubernetes,
        component: (
          <KubernetesInventory
            key={TabKeys.kubernetes}
            kubernetes={kubernetes}
            deleteKubernetes={deleteKubernetes}
            addKubernetes={addKubernetes}
            loading={kubernetesLoading}
          />
        ),
      },
      {
        label: Messages.tabs.dbcluster,
        key: TabKeys.dbclusters,
        disabled: kubernetes.length === 0 || isKubernetesListUnavailable(kubernetes),
        component: <DBCluster key={TabKeys.dbclusters} kubernetes={kubernetes} />,
      },
    ],
    [kubernetes, kubernetesLoading, addKubernetes, deleteKubernetes]
  );

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <TechnicalPreview />
      <div className={styles.panelContentWrapper}>
        <TabbedContent
          tabs={tabs}
          basePath={basePath}
          renderTab={({ Content }) => (
            <FeatureLoader featureName={Messages.dbaas} featureFlag="dbaasEnabled">
              <Content />
            </FeatureLoader>
          )}
        />
      </div>
    </PageWrapper>
  );
};

export default DBaaS;
