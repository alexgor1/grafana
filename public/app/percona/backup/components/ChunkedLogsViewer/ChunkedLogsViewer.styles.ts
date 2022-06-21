import { css } from 'emotion';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  loadingHolder: css`
    text-align: center;
  `,
  copyBtnHolder: css`
    display: inline-block;
  `,
});
