import type { Dispatch } from 'redux';
import { CMS_TOGGLE_EDIT_IN_PLACE, CMS_OPEN_EDITOR, CMS_CLOSE_EDITOR } from './cmsEditorReducer';
import { Content, RICH_CONTENT_CSS_CLASS } from '@stackend/api/cms';
import get from 'lodash-es/get';
import { Thunk } from '@stackend/api/api';
/*
import {
  Content,
  RICH_CONTENT_CSS_CLASS,
  extractContentValues,
  createContentValue,
  editContent
} from '@stackend/api/cms'; */
//import TinyMCEEditorAdapter from '../../editor/TinyMCEEditorAdapter.js';
//import EditorAdapter from '../../editor/EditorAdapter.js';
//import { setContent } from '@stackend/api/cms/cmsActions';
//import { getJsonErrorText, Thunk } from '@stackend/api/api';

/**
 * Cms content tagged with this class may be edited in place
 * @type {string}
 */
const EDITABLE_CSS_CLASS = 'stackend-edit';

// Can't keep these objects in redux state. Using a globals. Should be fine for client side
let _editor: any | null = null;

/**
 * Dom element holding the entire content
 */
//@ts-ignore
let _contentDomElement: any = null;

/**
 * Dom element holding the editable part of the content
 */
let _editableDomElement: any = null;

/**
 * Enable cms edit in place on entire page
 * @param enabled
 */
export function setEditInPlaceEnabled(enabled: boolean): Thunk<boolean> {
  return (dispatch: any /*, getState: any*/) => {
    if (!enabled) {
      if (!dispatch(closeEditor())) {
        return false;
      }
    }

    dispatch({
      type: CMS_TOGGLE_EDIT_IN_PLACE,
      enabled
    });

    return true;
  };
}

/**
 * Find an enclosing element with the supplied class name
 * @param element
 * @param className
 * @param upToClassName
 * @returns {*}
 */
function findEnclosingElementByClassName(
  element: Element | null,
  className: string,
  upToClassName?: string | null
): Element | null {
  let e: Element | null = element;

  while (e !== null) {
    if (e.classList && e.classList.contains(className)) {
      return e;
    }

    e = e.parentNode as Element;
    if (e === null || (upToClassName != null && e.classList && e.classList.contains(upToClassName))) {
      return null;
    }
  }

  return null;
}

/**
 * Open a content editor
 * @param content CMS content that should be edited
 * @param contentElement HTML elemen that should be edited
 */
export function openEditor(content: Content, contentElement: any): Thunk<void> {
  return (dispatch: any, getState: any) => {
    if (contentElement == null || content == null) {
      return;
    }

    // Find the closest stackend-editable element
    const e: Element | null = findEnclosingElementByClassName(contentElement, EDITABLE_CSS_CLASS, EDITABLE_CSS_CLASS);
    if (e === null) {
      console.warn('Could not find parent ' + EDITABLE_CSS_CLASS + ' of ', contentElement);
      return;
    }

    // Find the closest stackend-rich-content element
    const x = findEnclosingElementByClassName(e, RICH_CONTENT_CSS_CLASS);
    if (x === null) {
      console.error('Could not find parent ' + RICH_CONTENT_CSS_CLASS + ' of ', e, contentElement);
      return;
    }

    // HACK to get styling correct: add .stackend to RICH_CONTENT_CSS_CLASS
    x.classList.add('stackend');

    const { communities, cmsEditInPlace /*config, request, */ } = getState();
    if (cmsEditInPlace.editorOpen) {
      if (!dispatch(closeEditor())) {
        return;
      }
    }

    _contentDomElement = x;
    _editableDomElement = e;
    //let communityPermalink = get(communities, 'community.permalink');

    let language = get(communities, 'community.locale', 'en');
    language = language.replace(/_.*/, ''); // Remove country

    const id = ('#' + Math.random()).replace(/.\./, 'stackend-cms-editor-');

    const originalDisplay = _editableDomElement.style.display;
    const originalContent = _editableDomElement.outerHTML;
    const originalId = _editableDomElement.getAttribute('id');
    _editableDomElement.setAttribute('id', id);

    /* FIXME: Readd this
		_editor = new TinyMCEEditorAdapter({
			id,
			dispatch,
			communityPermalink,
			config,
			request,
			language,
			referenceId: content.id || 0,
			mediaContext: 'cms',
			overrides: {
				save_enablewhendirty: true,
				plugins: 'save',
				toolbar: 'save,close',
				target: _editableDomElement,
				save_onsavecallback: () => {
					dispatch(save());
				},
				save_oncancelcallback: () => {
					dispatch(closeEditor());
				}
			},
			handleChange: () => {},
			focusOnLoad: true,
			preLoadContent: originalContent,
			onEditorLoaded: (editor: EditorAdapter, api: any) => {
				api.addButton('close', {
					text: 'Close',
					icon: 'close',
					//image: require('../../../../img/dialog.close.000.gif'),
					onclick: () => {
						dispatch(closeEditor());
					}
				});
			}
		});

		_editor.createEditor();
		 */

    dispatch({
      type: CMS_OPEN_EDITOR,
      content,
      originalId,
      originalDisplay,
      originalContent
    });
  };
}

/*
function save(): Thunk<void> {
	return async (dispatch: any, getState: any) => {
		let { cmsEditInPlace } = getState();
		let { originalId, originalDisplay, content } = cmsEditInPlace;

		if (_editor) {
			let c = _editor.getContent();
			_editor.remove();

			// Reconstruct the entire content
			let { htmlValue, javascriptValue, cssValue } = extractContentValues(content);
			_editableDomElement.outerHTML = c;
			htmlValue = _contentDomElement.innerHTML;
			let body = createContentValue(htmlValue, cssValue, javascriptValue);

			let r = await dispatch(
				editContent({
					id: content.id,
					permalink: content.permalink,
					headline: content.headline,
					body: body
				})
			);

			if (r.error) {
				// FIMXE:
				alert('FIXME: ' + getJsonErrorText(r));
				return;
			}

			dispatch(setContent(r.content));

			_editor = null;
			_editableDomElement.setAttribute('id', originalId);
			_editableDomElement.style.display = originalDisplay;
			_editableDomElement.classList.remove('stackend');
			_editableDomElement = null;
			_contentDomElement = null;

			dispatch({
				type: CMS_CLOSE_EDITOR
			});
		}
	};
}
*/

export function closeEditor(): Thunk<boolean> {
  return (dispatch: Dispatch, getState: any) => {
    const { cmsEditInPlace } = getState();
    const { originalId, originalDisplay, originalContent } = cmsEditInPlace;

    if (_editor) {
      if (_editor.isDirty() && !confirm('Changes not saved. Close anyway?')) {
        return false;
      }
      _editor.remove();
      _editor = null;
      _editableDomElement.setAttribute('id', originalId);
      _editableDomElement.outerHTML = originalContent;
      _editableDomElement.style.display = originalDisplay;
      _editableDomElement.classList.remove('stackend');
      _editableDomElement = null;
      _contentDomElement = null;

      dispatch({
        type: CMS_CLOSE_EDITOR
      });
    }

    return true;
  };
}
