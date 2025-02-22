export const availableIconsIndex = {
  google: true,
  microsoft: true,
  github: true,
  gitlab: true,
  okta: true,
  anchor: true,
  'angle-double-down': true,
  'angle-double-right': true,
  'angle-double-up': true,
  'angle-down': true,
  'angle-left': true,
  'angle-right': true,
  'angle-up': true,
  apps: true,
  arrow: true,
  'arrow-down': true,
  'arrow-from-right': true,
  'arrow-left': true,
  'arrow-random': true,
  'arrow-right': true,
  'arrow-up': true,
  'arrows-h': true,
  'arrows-v': true,
  backward: true,
  bars: true,
  bell: true,
  'bell-slash': true,
  bolt: true,
  book: true,
  bookmark: true,
  'book-open': true,
  'brackets-curly': true,
  bug: true,
  building: true,
  'calculator-alt': true,
  'calendar-alt': true,
  camera: true,
  capture: true,
  'channel-add': true,
  'chart-line': true,
  check: true,
  'check-circle': true,
  'check-square': true,
  circle: true,
  'clipboard-alt': true,
  'clock-nine': true,
  cloud: true,
  'cloud-download': true,
  'cloud-upload': true,
  'code-branch': true,
  cog: true,
  columns: true,
  'comment-alt': true,
  'comment-alt-message': true,
  'comment-alt-share': true,
  'comments-alt': true,
  compass: true,
  copy: true,
  'credit-card': true,
  cube: true,
  dashboard: true,
  database: true,
  'document-info': true,
  'download-alt': true,
  draggabledots: true,
  edit: true,
  'ellipsis-v': true,
  envelope: true,
  'exchange-alt': true,
  'exclamation-triangle': true,
  'exclamation-circle': true,
  'external-link-alt': true,
  eye: true,
  'eye-slash': true,
  'ellipsis-h': true,
  'fa fa-spinner': true,
  favorite: true,
  'file-alt': true,
  'file-blank': true,
  'file-copy-alt': true,
  filter: true,
  folder: true,
  font: true,
  fire: true,
  'folder-open': true,
  'folder-plus': true,
  'folder-upload': true,
  forward: true,
  'gf-bar-alignment-after': true,
  'gf-bar-alignment-before': true,
  'gf-bar-alignment-center': true,
  'gf-glue': true,
  'gf-grid': true,
  'gf-interpolation-linear': true,
  'gf-interpolation-smooth': true,
  'gf-interpolation-step-after': true,
  'gf-interpolation-step-before': true,
  'gf-landscape': true,
  'gf-layout-simple': true,
  'gf-logs': true,
  'gf-portrait': true,
  'gf-service-account': true,
  'gf-show-context': true,
  grafana: true,
  'graph-bar': true,
  heart: true,
  'heart-break': true,
  history: true,
  home: true,
  'home-alt': true,
  'horizontal-align-center': true,
  'horizontal-align-left': true,
  'horizontal-align-right': true,
  hourglass: true,
  import: true,
  info: true,
  'info-circle': true,
  'key-skeleton-alt': true,
  keyboard: true,
  'layer-group': true,
  'library-panel': true,
  'line-alt': true,
  link: true,
  'list-ui-alt': true,
  'list-ul': true,
  lock: true,
  'map-marker': true,
  message: true,
  minus: true,
  'minus-circle': true,
  'mobile-android': true,
  monitor: true,
  palette: true,
  'panel-add': true,
  pause: true,
  pen: true,
  percentage: true,
  play: true,
  plug: true,
  plus: true,
  'plus-circle': true,
  'plus-square': true,
  power: true,
  'presentation-play': true,
  process: true,
  'question-circle': true,
  'record-audio': true,
  repeat: true,
  rocket: true,
  'ruler-combined': true,
  save: true,
  search: true,
  'search-minus': true,
  'search-plus': true,
  'share-alt': true,
  shield: true,
  'shield-exclamation': true,
  signal: true,
  signin: true,
  signout: true,
  sitemap: true,
  slack: true,
  'sliders-v-alt': true,
  'sort-amount-down': true,
  'sort-amount-up': true,
  'square-shape': true,
  star: true,
  'step-backward': true,
  'stopwatch-slash': true,
  sync: true,
  table: true,
  'tag-alt': true,
  'text-fields': true,
  times: true,
  'toggle-on': true,
  'trash-alt': true,
  unlock: true,
  upload: true,
  user: true,
  'users-alt': true,
  'vertical-align-bottom': true,
  'vertical-align-center': true,
  'vertical-align-top': true,
  'wrap-text': true,
  rss: true,
  x: true,
  'percona-add': true,
  'percona-alert': true,
  'percona-analytics': true,
  'percona-cluster-computing': true,
  'percona-cluster-network': true,
  'percona-cluster': true,
  'percona-cpu': true,
  'percona-dashboard': true,
  'percona-database-checks': true,
  'percona-database': true,
  'percona-disk': true,
  'percona-inventory': true,
  'percona-kubernetes': true,
  'percona-memory': true,
  'percona-network': true,
  'percona-process': true,
  'percona-setting': true,
  'percona-summary': true,
  'percona-surface': true,
  'percona-temperature': true,
  'pmm-logo': true,
  'pmm-logo-light': true,
  'qan-logo': true,
  'percona-system': true,
  'percona-nav-overview': true,
  'percona-nav-summary': true,
  'percona-database-mysql': true,
  'percona-database-postgresql': true,
  'percona-database-mongodb': true,
  'percona-database-proxysql': true,
  'percona-database-haproxy': true,
  ticket: true,
  clouds: true,
  'percona-bell': true,
  'percona-bell-slash': true,
  'angle-double-left': true,
  'times-circle': true,
  'percona-asterisk': true,
  'user-check': true,
  'user-square': true,
};

export type IconName = keyof typeof availableIconsIndex;

export function isIconName(iconName: unknown): iconName is IconName {
  if (!iconName || typeof iconName !== 'string') {
    return false;
  }

  return iconName in availableIconsIndex;
}

export function toIconName(iconName: string): IconName | undefined {
  if (isIconName(iconName)) {
    return iconName;
  }

  return undefined;
}
