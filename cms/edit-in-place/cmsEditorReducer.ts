import { Content } from '@stackend/api/cms';

export const CMS_TOGGLE_EDIT_IN_PLACE = 'CMS_TOGGLE_EDIT_IN_PLACE';
export const CMS_OPEN_EDITOR = 'CMS_OPEN_EDITOR';
export const CMS_CLOSE_EDITOR = 'CMS_CLOSE_EDITOR';

export interface CmsEditorState {
  enabled: boolean;
  editorOpen: boolean;
  content: Content | null;
  originalId: string | null;
  originalContent: string | null;
  originalDisplay: string | null;
}

export type CmsEditorActions =
  | {
      type: typeof CMS_TOGGLE_EDIT_IN_PLACE;
      enabled: boolean;
    }
  | {
      type: typeof CMS_OPEN_EDITOR;
      content: Content;
      originalId: string;
      originalContent: string;
      originalDisplay: string;
    }
  | {
      type: typeof CMS_CLOSE_EDITOR;
    };

export default function (
  state: CmsEditorState = {
    enabled: false,
    editorOpen: false,
    content: null,
    originalId: null,
    originalContent: null,
    originalDisplay: null
  },
  action: CmsEditorActions
) {
  switch (action.type) {
    case CMS_TOGGLE_EDIT_IN_PLACE:
      return Object.assign({}, state, {
        enabled: action.enabled
      });

    case CMS_OPEN_EDITOR:
      return Object.assign({}, state, {
        editorOpen: true,
        content: action.content,
        originalId: action.originalId,
        originalContent: action.originalContent,
        originalDisplay: action.originalDisplay
      });

    case CMS_CLOSE_EDITOR:
      return Object.assign({}, state, {
        editorOpen: false,
        content: null,
        originalId: null,
        originalContent: null,
        originalDisplay: null
      });

    default:
      return state;
  }
}
