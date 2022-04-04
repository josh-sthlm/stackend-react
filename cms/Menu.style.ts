import styled from 'styled-components';

import { media } from '../style-common/media';
import classNames from '../style-common/classNames';
import { getComponentBorder, getComponentProp } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';
import { zIndexes } from '../style-common/z-indexes';
import ComponentState from '../theme/ComponentState';

export const MenuLink = styled.a.attrs(props => ({ className: classNames('stackend-menu-link', props.className) }))`
  white-space: nowrap;
`;

export const MenuItem = styled.div.attrs(props => ({ className: classNames('stackend-menu-item', props.className) }))`
  color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color')};
  position: relative;

  &.stackend-menu-item-selected {
    > ${MenuLink} {
      font-weight: bold;
    }
`;

export const SubMenuItems = styled.div.attrs(props => ({
  className: classNames('stackend-submenu-items', props.className)
}))`
  border: ${props => getComponentBorder(props.theme, ComponentType.MENU)};
  border-radius: ${props => props.theme.borderRadius || '0'};
`;

export const Burger = styled.button.attrs(props => ({
  className: classNames('stackend-menu-burger stackend-icon', props.className)
}))``;

export const Menu = styled.nav.attrs(props => ({
  className: classNames('stackend-site-menu', props.className)
}))`
  background-color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor')};
  border-radius: ${props => props.theme.borderRadius || '0'};
  display: flex;
  gap: 1em;
  font-size: 1.25rem;
  line-height: 2em;
  margin: ${props => props.theme.margins.medium} 0;
  overflow: hidden;

  /* hack: don't pad if same color as bg */
  padding: 0;

  ${Burger} {
    display: none;
  }

  ${MenuItem} {
    padding: 0 ${props => props.theme.margins.medium};
    color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color')};
    ${MenuLink} {
      color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color')};
    }
  }

  &.stackend-menu-vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;

    ${MenuItem} {
      display: block;

      ${MenuLink} {
        display: inline-block;
      }

      ${SubMenuItems} {
        display: none;
      }

      &.stackend-menu-item-selected {
        ${SubMenuItems} {
          display: block;
        }
      }
    }

    ${SubMenuItems} {
      margin-left: 1em;
      border: none;
    }
  }

  &.stackend-menu-horizontal,
  &.stackend-menu-fixed {
    flex-direction: row;
    align-items: center;
    gap: ${props => props.theme.margins.medium};

    ${MenuItem} {
      display: inline-block;
      position: relative;

      ${SubMenuItems} {
        display: none;
        background-color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor') || '#ffffff'};
        box-shadow: 1px 2px 2px 1px
          ${props => getComponentProp(props.theme, ComponentType.MENU, 'borderColor') || '#e6e6e6'};
        border-radius: 0 0 ${props => props.theme?.borderRadius || '3px'} ${props => props.theme?.borderRadius || '3px'};
        border: ${props => getComponentBorder(props.theme, ComponentType.MENU) || '1px solid #e6e6e6'};
        padding: ${props => props.theme.margins.small} ${props => props.theme.margins.medium};

        ${MenuItem} {
          width: 100%;
          ${MenuLink} {
            width: 100%;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      &.stackend-submenu-open {
        > ${SubMenuItems} {
          display: inline-block;
          position: absolute;
          left: ${props => '-' + props.theme.margins.small};
          top: 2em;
          min-width: 100%;
          z-index: ${zIndexes.onTop};
        }
      }
    }

    > ${MenuItem} {
      &:hover {
        color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'color', ComponentState.ACTIVE_HOVER)};
        background-color: ${props =>
          getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor', ComponentState.ACTIVE_HOVER)};
      }
      &:first-child {
        border-top-left-radius: ${props => props.theme.borderRadius};
        border-bottom-left-radius: ${props => props.theme.borderRadius};
      }
      &:last-child {
        border-top-right-radius: ${props => props.theme.borderRadius};
        border-bottom-right-radius: ${props => props.theme.borderRadius};
      }
    }

    /* Turn into vertical menu for small screens */
    ${media.tabletScreen} {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      background: none;

      &.stackend-menu-active {
        background-color: ${props => getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor')};
        ${Burger} {
          margin-left: ${props =>
            getComponentProp(props.theme, ComponentType.MENU, 'backgroundColor') !==
            getComponentProp(props.theme, ComponentType.TEXT, 'backgroundColor')
              ? '-' + props.theme.margins.medium
              : '0'};
        }
      }

      ${Burger} {
        display: inline-flex;
      }

      > ${MenuItem} {
        margin-left: ${props => props.theme.margins.small}; /* to match indentation of burger */
      }

      ${MenuItem} {
        display: block;

        ${SubMenuItems} {
          display: block;
          background: inherit;
          box-shadow: none;
          margin-left: 1em;
          border: none;
          padding: 0;
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

  &.stackend-menu-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0;
    border-radius: 0;
    padding: 0 ${props => props.theme.margins.medium};
    z-index: ${zIndexes.cmsMenu};
  }
`;
