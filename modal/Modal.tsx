import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactModal from 'react-modal';
import { closeModal } from './modalActions';
import * as Sc from './Modal.style';

function mapStateToProps({ openModals }: any, { modalName }: any) {
  return {
    isOpen: openModals.modalName === modalName
  };
}

const mapDispatchToProps = {
  closeModal
};

export type Props = {
  children: any; //content of the modal
  modalName: string; //unique identifier used to open the modal
  isOpen?: boolean;
  className?: string;
  overlayClassName?: string;
  onAfterOpen: () => any;
  /**
   * Scroll the content? Default: true
   */
  scroll: boolean;

  closeModal?: any;
};

class Modal extends Component<Props> {
  render() {
    const {
      isOpen,
      className = '',
      overlayClassName = '',
      modalName = '',
      closeModal,
      onAfterOpen,
      scroll
    } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        className={
          className +
          (typeof scroll === 'undefined' || scroll ? ' stackend-modal-scrolled' : ' stackend-modal-not-scrolled')
        }
        overlayClassName={overlayClassName}
        onRequestClose={closeModal}
        contentLabel={modalName}
        onAfterOpen={onAfterOpen}
        ariaHideApp={false}
        /* These class names are required for styled components and to avoid conflicts */
        portalClassName="stackend stackend-modal StackendModalPortal ReactModalPortal">
        <Sc.ModalContent>{this.props.children}</Sc.ModalContent>
      </ReactModal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
