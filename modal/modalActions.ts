import * as modalReducer from './modalReducer';
import { AnyAction } from 'redux';

/**
 * Open a modal
 * @param modalName
 * @param modalProps
 */
export function openModal({ modalName, modalProps }: { modalName: string; modalProps?: any }): AnyAction {
  return {
    type: modalReducer.OPEN_MODAL,
    modalName,
    modalProps
  };
}

/**
 * Close a modal
 * @param modalName
 */
export function closeModal({ modalName }: { modalName: string }): AnyAction {
  return {
    type: modalReducer.CLOSE_MODAL,
    modalName
  };
}

/**
 * Check if a modal is open
 * @param state
 * @param modalName
 */
export function isModalOpen(state: modalReducer.ModalState, modalName: string): boolean {
  if (!state || !state.modalName) {
    return false;
  }

  return state.modalName === modalName;
}
