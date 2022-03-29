import styled from 'styled-components';

import { media } from '../style-common/media';
import classNames from '../style-common/classNames';
import { getComponentBorder, getComponentProp } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';

export const MenuLink = styled.a.attrs(props => ({ className: classNames('stackend-menu-link', props.className) }))`
  white-space: nowrap;
`;

export const MenuItem = styled.div.attrs(props => ({ className: classNames('stackend-menu-item', props.className) }))``;

export const SubMenuItems = styled.div.attrs(props => ({
  className: classNames('stackend-submenu-items', props.className)
}))``;

export const Burger = styled.button.attrs(props => ({
  className: classNames('stackend-menu-burger stackend-icon', props.className)
}))``;

export const Menu = styled.nav.attrs(props => ({
  className: classNames('stackend-site-menu', props.className)
}))`
  background-color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor')};
  border: ${props => getComponentBorder(props.theme, ComponentType.MENU)};
  border-radius: ${props => props.theme.borderRadius || '0'};

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
      color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color')};

      ${MenuLink} {
        display: inline-block;
        color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color')};

        @media (pointer: coarse) {
          padding: 0.5em 0;
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
      margin-left: ${props => props.theme.margins?.medium || '1em'};
      padding: ${props => props.theme.margins?.small || '0.5em'} ${props => props.theme.margins?.medium || '1em'};
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
          top: calc(2em + 4px); /* FIXME: height + margin + padding + some space */
          min-width: 100%;
        }
      }

      ${SubMenuItems} {
        display: none;
        background-color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor') || '#ffffff'};
        box-shadow: 1px 1px 4px 1px
          ${props => getComponentProp(props.theme, ComponentType.MENU, 'borderColor') || '#e6e6e6'};
        border-radius: ${props => props.theme?.borderRadius || '3px'};

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
        display: inline-flex;
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
