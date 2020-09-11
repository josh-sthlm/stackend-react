
import React, { Component, Fragment, MouseEvent } from 'react';
import {
	SubSite,
	SubSiteNode,
	MenuVisibility
} from '@stackend/api/cms';
import * as Sc from './Menu.style.js';
import { getPermalink, getTreePath, Node } from '@stackend/api/api/tree';
import { getSubSitePageHashPermalink } from '@stackend/api/cms/pageActions';

type Props = {
	subSite: SubSite,
	selectedPath: Array<Node>,
	menuVisibility?: MenuVisibility | null,
	onNavigate: (e: Event, node: SubSiteNode, path: Array<SubSiteNode> | null) => void
};

type State = {
	open: boolean /* Open state, in mobile mode */,
	openPermalink: string | null /* permalink to open menu item */
};

/**
 * Render a subsite menu
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
			default:
				return 'stackend-menu-off';
		}
	}

	componentDidMount() {
		document.body.addEventListener('click', this.onWindowClicked);
	}

	componentWillUnmount() {
		document.body.removeEventListener('click', this.onWindowClicked);
	}

	onWindowClicked = (e: Event) => {
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

	render() {
		const { subSite, menuVisibility, selectedPath } = this.props;
		const { open } = this.state;
		if (!subSite || subSite.children.length === 0 || menuVisibility === MenuVisibility.OFF) {
			return null;
		}

		let selectedPathPermalink = getPermalink(selectedPath);
		let c = Menu.getMenuVisibilityClass(menuVisibility);

    let klass: string = c + (open ? ' stackend-menu-active' : ' stackend-menu-inactive');

		return (
			<Sc.Menu
        //@ts-ignore
        className={klass}>
				{menuVisibility === MenuVisibility.HORIZONTAL && (
					<Sc.Burger onClick={this.onMenuToggled}>
						<i className="material-icons">menu</i>
					</Sc.Burger>
				)}
				{subSite.children.map((item: SubSiteNode, i: number) =>
					this.renderItem(item, i, selectedPathPermalink)
				)}
			</Sc.Menu>
		);
	}

	onMenuToggled = (e: MouseEvent) => {
		const { open } = this.state;
		this.setState({
			open: !open
		});
	};

	onItemClicked = (e: MouseEvent, item: SubSiteNode) => {
		e.preventDefault();
		e.stopPropagation();

		const { subSite, menuVisibility } = this.props;
		let path = getTreePath(subSite, item);

		// Special case for mobile where hover is not supported: open the menu
		if (path && menuVisibility === MenuVisibility.HORIZONTAL) {
			if (item.children.length !== 0 /*&& matchMedia("(hover:none)").matches*/) {
				const { openPermalink } = this.state;
				let pl = getPermalink(path);
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

	renderItem = (item: SubSiteNode, i: number, selectedPathPermalink: string) => {
		const { subSite } = this.props;
		let hasSubmenu = item.children.length !== 0;
		let link = null;

		let treePath = getTreePath(subSite, item);
		let permalink = treePath ? getPermalink(treePath) : '';
		let klass: string = 'stackend-menu-path' + permalink.replace(/\//g, '-');

		if (item.ref !== null) {
			link = getSubSitePageHashPermalink({ permalink, treePath: null });
		} else if (item.data.link != null) {
			link = item.data.link;
		}

		let isSelected = selectedPathPermalink.startsWith(permalink);
		let isMenuOpen = hasSubmenu && this.state.openPermalink === permalink;

		return (
			<Sc.MenuItem
				className={
          (klass +
					' ' +
					(hasSubmenu ? ' stackend-menu-has-submenu' : '') +
					(isMenuOpen ? ' stackend-submenu-open' : '') +
					(isSelected ? ' stackend-menu-item-selected' : '')) as any
				}
				key={'i' + item.permalink}>
				{link ? (
					<Sc.MenuLink href={link} onClick={(e: any) => this.onItemClicked(e, item)}>
						{item.name}
					</Sc.MenuLink>
				) : (
					<Fragment>{item.name}</Fragment>
				)}
				{hasSubmenu && (
					<Sc.SubMenuItems>
						{item.children.map((c: SubSiteNode, j: number) =>
							this.renderItem(c, j, selectedPathPermalink)
						)}
					</Sc.SubMenuItems>
				)}
			</Sc.MenuItem>
		);
	};
}
