import React, { Component } from "react";
import {Modal, ModalHeader, ModalBody } from "reactstrap";

class Modal_Popup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modal}
          toggle={this.props.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle}>
            {this.props.title}
          </ModalHeader>
          <ModalBody>{this.props.children}</ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Modal_Popup;
