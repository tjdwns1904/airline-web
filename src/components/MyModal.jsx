import React from "react";
import { Modal, Button } from "react-bootstrap";

function MyModal(props) {
    return (
        <Modal className="modal-container" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.content}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>Close</Button>
                <Button onClick={() => {
                    props.handleClose();
                    props.handleData();
                }}>{props.btnContent}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MyModal;