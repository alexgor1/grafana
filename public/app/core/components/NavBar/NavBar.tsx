import { css, cx } from '@emotion/css';
import { logger } from '@percona/platform-core';
import { cloneDeep } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { GrafanaTheme2, NavModelItem, NavSection } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Icon, IconName, useTheme2 } from '@grafana/ui';
import { Branding } from 'app/core/components/Branding/Branding';
import config from 'app/core/config';
import { getKioskMode } from 'app/core/navigation/kiosk';
import { SettingsService } from 'app/percona/settings/Settings.service';
import { isPmmAdmin } from 'app/percona/shared/helpers/permissions';
import { KioskMode, StoreState } from 'app/types';

import { OrgSwitcher } from '../OrgSwitcher';

import NavBarItem from './NavBarItem';
import { NavBarItemWithoutMenu } from './NavBarItemWithoutMenu';
import { NavBarMenu } from './NavBarMenu';
import { NavBarSection } from './NavBarSection';
import {
  buildIntegratedAlertingMenuItem,
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
  const kiosk = getKioskMode();
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const toggleSwitcherModal = () => {
    setShowSwitcherModal(!showSwitcherModal);
  };
  const navTree: NavModelItem[] = cloneDeep(navBarTree);
  const [topItems, setTopItems] = useState(navTree.filter((item) => item.section === NavSection.Core));
  const bottomItems = enrichConfigItems(
    navTree.filter((item) => item.section === NavSection.Config),
    location,
    toggleSwitcherModal
  );
  const activeItem = isSearchActive(location) ? searchItem : getActiveItem(navTree, location.pathname);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateMenu = async () => {
      try {
        const settings = await SettingsService.getSettings(undefined, true);
        const newItems: NavModelItem[] = [...topItems];

        if (settings.alertingEnabled) {
          buildIntegratedAlertingMenuItem(newItems);
        }

        if (settings.sttEnabled) {
          newItems.push({
            id: 'databsase-checks',
            icon: 'percona-database-checks',
            text: 'Security Checks',
            url: `${config.appSubUrl}/pmm-database-checks`,
          });
        }

        if (settings.dbaasEnabled) {
          newItems.push({
            id: 'dbaas',
            text: 'DBaaS',
            icon: 'database',
            url: `${config.appSubUrl}/dbaas`,
          });
        }

        newItems.push({
          id: 'backup',
          icon: 'history',
          text: 'Backup',
          url: `${config.appSubUrl}/backup`,
        });

        setTopItems(newItems);
      } catch (e) {
        logger.error(e);
      }
    };
    if (isPmmAdmin(config.bootData.user)) {
      updateMenu();
    }
  }, [topItems]);

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
