import React, { Component, Fragment, MouseEvent } from 'react';
import { SubSite, SubSiteNode, MenuVisibility } from '@stackend/api/cms';
import * as Sc from './Menu.style';
import { getPermalink, getTreePath, Node } from '@stackend/api/api/tree';
import { getSubSitePageHashPermalink } from '@stackend/api/cms/pageActions';

type Props = {
  subSite: SubSite;
  selectedPath: Array<Node>;
  menuVisibility?: MenuVisibility | null;
  onNavigate: (e: Event, node: SubSiteNode, path: Array<SubSiteNode> | null) => void;
};

type State = {
  open: boolean /* Open state, in mobile mode */;
  openPermalink: string | null /* permalink to open menu item */;
};

/**
 * Render a sub site menu
 */
export default class Menu extends Component<Props, State> {
  state = {
    open: false,
    openPermalink: null
  };

  burgerRef = React.createRef();

  static getMenuVisibilityClass(visibility: MenuVisibility | null | undefined): string {
    if (!visibility) {
      return 'stackend-menu-horizontal';
    }

    switch (visibility) {
      case MenuVisibility.HORIZONTAL:
        return 'stackend-menu-horizontal';
      case MenuVisibility.VERTICAL:
        return 'stackend-menu-vertical';
      case MenuVisibility.FIXED:
        return 'stackend-menu-fixed';
      default:
        return 'stackend-menu-off';
    }
  }

  componentDidMount(): void {
    document.body.addEventListener('click', this.onWindowClicked as EventListener);
  }

  componentWillUnmount(): void {
    document.body.removeEventListener('click', this.onWindowClicked as EventListener);
  }

  onWindowClicked = (e: Event): void => {
    // The event bubbles down from window to the burger
    if (this.burgerRef.current === null) {
      return;
    }

    let n: Element | null = e.target as Element;
    do {
      if (n === this.burgerRef.current) {
        const { open } = this.state;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          open: !open
        });
        return;
      }
      n = n.parentElement;
    } while (n !== null);

    this.setState({
      open: false,
      openPermalink: null
    });
  };

  render(): JSX.Element | null {
    const { subSite, menuVisibility, selectedPath } = this.props;
    const { open } = this.state;
    if (!subSite || subSite.children.length === 0 || menuVisibility === MenuVisibility.OFF) {
      return null;
    }

    const selectedPathPermalink = getPermalink(selectedPath);
    const c = Menu.getMenuVisibilityClass(menuVisibility);

    const klass: string = c + (open ? ' stackend-menu-active' : ' stackend-menu-inactive');

    return (
      <Sc.Menu className={klass}>
        {menuVisibility === MenuVisibility.HORIZONTAL && (
          <Sc.Burger onClick={this.onMenuToggled}>
            <i className="material-icons">menu</i>
          </Sc.Burger>
        )}
        {subSite.children.map((item: SubSiteNode, i: number) => this.renderItem(item, i, selectedPathPermalink))}
      </Sc.Menu>
    );
  }

  onMenuToggled = (e: MouseEvent): void => {
    const { open } = this.state;
    this.setState({
      open: !open
    });
  };

  onItemClicked = (e: MouseEvent, item: SubSiteNode): void => {
    e.preventDefault();
    e.stopPropagation();

    const { subSite, menuVisibility } = this.props;
    const path = getTreePath(subSite, item);

    // Special case for mobile where hover is not supported: open the menu
    if (path && menuVisibility === MenuVisibility.HORIZONTAL) {
      if (item.children.length !== 0 /*&& matchMedia("(hover:none)").matches*/) {
        const { openPermalink } = this.state;
        const pl = getPermalink(path);
        if (openPermalink !== pl) {
          this.setState({
            openPermalink: pl
          });
          return;
        }
      }
      this.setState({
        openPermalink: null,
        open: false
      });
    }

    if (this.props.onNavigate) {
      this.props.onNavigate(e as any, item, path);
    }
  };

  renderItem = (item: SubSiteNode, i: number, selectedPathPermalink: string): JSX.Element | null => {
    const { subSite } = this.props;
    const hasSubmenu = item.children.length !== 0;
    let link = null;

    const treePath = getTreePath(subSite, item);
    const permalink = treePath ? getPermalink(treePath) : '';
    const klass: string = 'stackend-menu-path' + permalink.replace(/\//g, '-');

    if (item.ref !== null) {
      link = getSubSitePageHashPermalink({ permalink, treePath: null });
    } else if (item.data.link != null) {
      link = item.data.link;
    }

    const isSelected = selectedPathPermalink.startsWith(permalink);
    const isMenuOpen = hasSubmenu && this.state.openPermalink === permalink;

    return (
      <Sc.MenuItem
        className={
          klass +
          ' ' +
          (hasSubmenu ? ' stackend-menu-has-submenu' : '') +
          (isMenuOpen ? ' stackend-submenu-open' : '') +
          (isSelected ? ' stackend-menu-item-selected' : '')
        }
        key={'i' + item.permalink}>
        {link ? (
          <Sc.MenuLink href={link} onClick={(e): void => this.onItemClicked(e, item)}>
            {item.name}
          </Sc.MenuLink>
        ) : (
          <Fragment>{item.name}</Fragment>
        )}
        {hasSubmenu && (
          <Sc.SubMenuItems>
            {item.children.map((c: SubSiteNode, j: number) => this.renderItem(c, j, selectedPathPermalink))}
          </Sc.SubMenuItems>
        )}
      </Sc.MenuItem>
    );
  };
}
