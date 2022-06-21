import { css } from 'emotion';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ palette }: GrafanaTheme) => ({
  statusContainer: css`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  `,
  ellipsisContainer: css`
    display: table;
    width: 15px;
  `,
  statusSuccess: css`
    color: ${palette.greenBase};
  `,
  statusError: css`
    color: ${palette.redBase};
  `,
  logs: css`
    float: right;
    color: ${palette.blue77};
    text-decoration: underline;
    cursor: pointer;
  `,
});
