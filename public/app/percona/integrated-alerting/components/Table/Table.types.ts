/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Column,
  TableInstance,
  TableState,
  Row,
  TableOptions,
  TableHeaderProps,
  TableRowProps,
  TableCellProps,
  Cell,
  ColumnInstance,
  HeaderGroup,
} from 'react-table';

import { SelectableValue } from '@grafana/data';

export interface ExtendedTableRowProps extends TableRowProps {
  onClick?: () => void;
}

export interface ExtendedTableCellProps extends TableCellProps {
  onClick?: () => void;
}

export interface ExtendedTableHeaderProps extends TableHeaderProps {
  onClick?: () => void;
}

export type ExtendedColumn<D extends object = {}> = Column<D> & {
  type?: FilterFieldTypes;
  options?: Array<SelectableValue<any>>;
  label?: string;
};

export enum FilterFieldTypes {
  TEXT,
  RADIO_BUTTON,
  DROPDOWN,
}

export interface TableProps {
  data: object[];
  columns: Array<ExtendedColumn<any>>;
  pendingRequest?: boolean;
  emptyMessage?: React.ReactNode;
  showPagination?: boolean;
  totalItems: number;
  totalPages?: number;
  tableHash?: string;
  pageSize?: number;
  pageIndex?: number;
  pagesPerView?: number;
  autoResetPage?: boolean;
  autoResetExpanded?: boolean;
  onPaginationChanged?: (pageSize: number, pageIndex: number) => void;
  children?: (rows: Row[], table: TableInstance) => React.ReactNode;
  renderExpandedRow?: (row: Row<any>) => React.ReactNode;
  getHeaderProps?: (column: HeaderGroup) => ExtendedTableHeaderProps;
  getRowProps?: (row: Row<any>) => ExtendedTableRowProps;
  getColumnProps?: (column: ColumnInstance) => ExtendedTableCellProps;
  getCellProps?: (cell: Cell<any, any>) => ExtendedTableCellProps;
  getRowId?: (originalRow: any, relativeIndex: number, parent?: Row<any>) => string;
  showFilter?: boolean;
  hasBackendFiltering?: boolean;
}

export interface PaginatedTableState extends TableState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginatedTableOptions extends TableOptions<object> {
  manualPagination?: boolean;
  pageCount?: number;
  autoResetPage?: boolean;
  autoResetExpanded?: boolean;
}
