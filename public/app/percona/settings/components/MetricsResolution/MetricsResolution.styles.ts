import { css } from 'emotion';

import { GrafanaTheme } from '@grafana/data';
import { stylesFactory } from '@grafana/ui';

export const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  resolutionsWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  resolutionsRadioButtonGroup: css`
    padding: ${theme.spacing.lg} 0 ${theme.spacing.xl} 0;
  `,
  resolutionInput: css`
    input {
      width: 60px;
    }
  `,
  numericFieldWrapper: css`
    width: 100px;
    white-space: nowrap;
  `,
}));
