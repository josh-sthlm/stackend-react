
import styled from 'styled-components';
import * as sc from '../style-common/styled-variables.style';
import { media } from '../style-common/media';

export const MenuLink = styled.a.attrs({ className: 'stackend-menu-link' })`
	white-space: nowrap;
`;

export const MenuItem = styled.div.attrs({ className: 'stackend-menu-item' })``;

export const SubMenuItems = styled.div.attrs({ className: 'stackend-submenu-items' })``;

export const Burger = styled.button.attrs({ className: 'stackend-menu-burger' })`
	padding: 0.25em 0;
	width: 100%;
	text-align: left;
`;

export const Menu = styled.nav.attrs({
	className: 'stackend-site-menu'
})`
	${media.tabletScreen} {
		line-height: 2em;
	}

	${Burger} {
		display: none;
	}

	&.stackend-menu-vertical {
		margin-right: 2em;

		${MenuItem} {
			display: block;
			margin: 0.5em 0;

			${MenuLink} {
				display: inline-block;

				@media (pointer: coarse) {
					padding: 0.5em 0;
				}

				&:hover {
					color: ${sc.colorTextAccent};
				}
			}

			${SubMenuItems} {
				display: none;
			}

			&.stackend-menu-item-selected {
				> ${MenuLink} {
					font-weight: bold;
				}

				${SubMenuItems} {
					display: block;
				}
			}
		}

		${SubMenuItems} {
			margin-left: 1em;
		}
	}

	&.stackend-menu-horizontal {
		${MenuItem} {
			display: inline-block;
			margin-left: 1em;
			padding: 0.5em 1em;
			position: relative;

			&:first-of-type {
				margin-left: 0;
			}

			${MenuLink} {
				font-weight: bold;
			}

			&.stackend-submenu-open {
				> ${SubMenuItems} {
					display: inline-block;
					position: absolute;
					left: 0;
					top: 2.1em; /* FIXME */
					min-width: 100%;
				}
			}

			${SubMenuItems} {
				display: none;
				background: ${sc.backgroundColor};
				box-shadow: 1px 1px 4px 1px #e6e6e6;

				${MenuItem} {
					margin-left: 0;
					width: 100%;
					${MenuLink} {
						width: 100%;
						display: inline-block;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}

		/* Turn into vertical menu for small screens */
		${media.tabletScreen} {
			margin-bottom: 1em;

			${Burger} {
				display: block;
			}

			${MenuItem} {
				display: block;
				margin-left: 0;

				${SubMenuItems} {
					display: block;
					background: inherit;
					box-shadow: none;
					margin-left: 1em;
				}

				&.stackend-submenu-open {
					> ${SubMenuItems} {
						display: block;
						position: static;
					}
				}
			}

			&.stackend-menu-inactive {
				${MenuItem} {
					display: none;
				}
			}
		}
	}
`;
