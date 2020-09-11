
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export type ModalState = {
	/**
	 * Open modal, if any
	 */
	modalName?: string,

	/**
	 * Options for the modal
	 */
	modalProps?: any
};

/**
 * Modal reducer
 * @param state
 * @param action
 */
export default function openModals(
	state: ModalState = {},
	action: { type: string, modalName: string, modalProps: any }
): any {
	switch (action.type) {
		case OPEN_MODAL:
			return (state = {
				modalName: action.modalName,
				modalProps: action.modalProps
			});
		case CLOSE_MODAL:
			return (state = {});
		default:
			return state;
	}
}
