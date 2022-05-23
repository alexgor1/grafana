import { css, cx } from '@emotion/css';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { GrafanaTheme2, NavModelItem, NavSection } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Icon, IconName, useTheme2 } from '@grafana/ui';
import { updateNavIndex } from 'app/core/actions';
import { Branding } from 'app/core/components/Branding/Branding';
import config from 'app/core/config';
import { getKioskMode } from 'app/core/navigation/kiosk';
import { getPerconaSettings, getPerconaUser } from 'app/percona/shared/core/selectors';
import { KioskMode, StoreState } from 'app/types';

import { OrgSwitcher } from '../OrgSwitcher';

import NavBarItem from './NavBarItem';
import { NavBarItemWithoutMenu } from './NavBarItemWithoutMenu';
import { NavBarMenu } from './NavBarMenu';
import { NavBarSection } from './NavBarSection';
import {
  getPmmSettingsPage,
  PMM_ADD_INSTANCE_PAGE,
  PMM_ALERTING_PAGE,
  PMM_BACKUP_PAGE,
  PMM_DBAAS_PAGE,
  PMM_ENTITLEMENTS_PAGE,
  PMM_ENVIRONMENT_OVERVIEW_PAGE,
  PMM_INVENTORY_PAGE,
  PMM_STT_PAGE,
  PMM_TICKETS_PAGE,
} from './constants';
import {
  buildIntegratedAlertingMenuItem,
  buildInventoryAndSettings,
  enrichConfigItems,
  getActiveItem,
  isMatchOrChildMatch,
  isSearchActive,
  SEARCH_ITEM_ID,
} from './utils';

const homeUrl = config.appSubUrl || '/';

const onOpenSearch = () => {
  locationService.partial({ search: 'open' });
};

const searchItem: NavModelItem = {
  id: SEARCH_ITEM_ID,
  onClick: onOpenSearch,
  text: 'Search dashboards',
  icon: 'search',
};

const mapStateToProps = (state: StoreState) => ({
  navBarTree: state.navBarTree,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {}

export const NavBarUnconnected = React.memo(({ navBarTree }: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const location = useLocation();
  const dispatch = useDispatch();
  const kiosk = getKioskMode();
  const { result } = useSelector(getPerconaSettings);
  const { sttEnabled, alertingEnabled, dbaasEnabled, backupEnabled } = result!;
  const { isPlatformUser, isAuthorized } = useSelector(getPerconaUser);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const toggleSwitcherModal = () => {
    setShowSwitcherModal(!showSwitcherModal);
  };
  const navTree: NavModelItem[] = cloneDeep(navBarTree);
  const topItems = navTree.filter((item) => item.section === NavSection.Core);
  const bottomItems = enrichConfigItems(
    navTree.filter((item) => item.section === NavSection.Config),
    location,
    toggleSwitcherModal
  );
  const activeItem = isSearchActive(location) ? searchItem : getActiveItem(navTree, location.pathname);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  dispatch(updateNavIndex(getPmmSettingsPage(alertingEnabled)));
  dispatch(updateNavIndex(PMM_ALERTING_PAGE));
  dispatch(updateNavIndex(PMM_STT_PAGE));
  dispatch(updateNavIndex(PMM_DBAAS_PAGE));
  dispatch(updateNavIndex(PMM_BACKUP_PAGE));
  dispatch(updateNavIndex(PMM_INVENTORY_PAGE));
  dispatch(updateNavIndex(PMM_ADD_INSTANCE_PAGE));
  dispatch(updateNavIndex(PMM_TICKETS_PAGE));
  dispatch(updateNavIndex(PMM_ENTITLEMENTS_PAGE));
  dispatch(updateNavIndex(PMM_ENVIRONMENT_OVERVIEW_PAGE));

  if (isPlatformUser) {
    topItems.push(PMM_ENTITLEMENTS_PAGE);
    topItems.push(PMM_TICKETS_PAGE);
    topItems.push(PMM_ENVIRONMENT_OVERVIEW_PAGE);
  }

  if (isAuthorized) {
    buildInventoryAndSettings(topItems);

    if (alertingEnabled) {
      buildIntegratedAlertingMenuItem(topItems);
    }

    if (sttEnabled) {
      topItems.push(PMM_STT_PAGE);
    }

    if (dbaasEnabled) {
      topItems.push(PMM_DBAAS_PAGE);
    }

    if (backupEnabled) {
      topItems.push(PMM_BACKUP_PAGE);
    }
  }

  if (kiosk !== KioskMode.Off) {
    return null;
  }

  return (
    <nav className={cx(styles.sidemenu, 'sidemenu')} data-testid="sidemenu" aria-label="Main menu">
      <div className={styles.mobileSidemenuLogo} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} key="hamburger">
        <Icon name="bars" size="xl" />
      </div>

      <NavBarSection>
        <NavBarItemWithoutMenu label="Home" className={styles.grafanaLogo} url={homeUrl}>
          <Branding.MenuLogo />
        </NavBarItemWithoutMenu>
        <NavBarItem className={styles.search} isActive={activeItem === searchItem} link={searchItem}>
          <Icon name="search" size="xl" />
        </NavBarItem>
      </NavBarSection>

      <NavBarSection>
        {topItems.map((link, index) => (
          <NavBarItem
            key={`${link.id}-${index}`}
            isActive={isMatchOrChildMatch(link, activeItem)}
            link={{ ...link, subTitle: undefined, onClick: undefined }}
          >
            {link.icon && <Icon name={link.icon as IconName} size="xl" />}
            {link.img && <img src={link.img} alt={`${link.text} logo`} />}
          </NavBarItem>
        ))}
      </NavBarSection>

      <div className={styles.spacer} />

      <NavBarSection>
        {bottomItems.map((link, index) => (
          <NavBarItem
            key={`${link.id}-${index}`}
            isActive={isMatchOrChildMatch(link, activeItem)}
            reverseMenuDirection
            link={link}
          >
            {link.icon && <Icon name={link.icon as IconName} size="xl" />}
            {link.img && <img src={link.img} alt={`${link.text} logo`} />}
          </NavBarItem>
        ))}
      </NavBarSection>

      {showSwitcherModal && <OrgSwitcher onDismiss={toggleSwitcherModal} />}
      {mobileMenuOpen && (
        <NavBarMenu
          activeItem={activeItem}
          navItems={[searchItem, ...topItems, ...bottomItems]}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
});

NavBarUnconnected.displayName = 'NavBar';

export const NavBar = connector(NavBarUnconnected);

const getStyles = (theme: GrafanaTheme2) => ({
  search: css`
    display: none;
    margin-top: ${theme.spacing(5)};

    ${theme.breakpoints.up('md')} {
      display: block;
    }
  `,
  sidemenu: css`
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: ${theme.zIndex.sidemenu};

    ${theme.breakpoints.up('md')} {
      background: ${theme.colors.background.primary};
      border-right: 1px solid ${theme.components.panel.borderColor};
      padding: 0 0 ${theme.spacing(1)} 0;
      position: relative;
      width: ${theme.components.sidemenu.width}px;
    }

    .sidemenu-hidden & {
      display: none;
    }
  `,
  grafanaLogo: css`
    display: none;
    img {
      height: ${theme.spacing(3.5)};
      width: ${theme.spacing(3.5)};
    }

    ${theme.breakpoints.up('md')} {
      align-items: center;
      display: flex;
      justify-content: center;
    }
  `,
  mobileSidemenuLogo: css`
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${theme.spacing(2)};

    ${theme.breakpoints.up('md')} {
      display: none;
    }
  `,
  spacer: css`
    flex: 1;
  `,
});
