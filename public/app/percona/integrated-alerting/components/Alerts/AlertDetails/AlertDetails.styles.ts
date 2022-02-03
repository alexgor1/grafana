import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  wrapper: css`
    display: flex;
    align-items: center;

    & > * {
      flex: 1 0 50%;
      display: flex;
      align-items: center;

      &:first-child {
        margin-right: ${spacing.md};
      }

      & > span {
        margin-right: ${spacing.md};
      }
    }

    pre {
      margin-bottom: 0;
    }
  `,
});
