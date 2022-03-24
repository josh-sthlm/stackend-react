import { Reducer } from 'redux';
import openModals from '../modal/modalReducer';
import cmsEditInPlace from '../cms/edit-in-place/cmsEditorReducer';
import shopUi from '../shop/shopUiReducer';

export const REDUCERS: { [name: string]: Reducer<any, any> } = {
  openModals,
  cmsEditInPlace,
  shopUi
};
