import React from 'react';
import {Button, Modal} from "react-bootstrap";

const ModalDelete = ({textBody, triggerAction, btnText, className}) => {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button type="button" className={className || "m-3 btn btn-sm btn-danger"} onClick={() => handleShow()}>
                {btnText}
            </button>

            <Modal
                show={show}
                onHide={() => handleClose()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete film</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {textBody || "Are you sure?"}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleClose()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        triggerAction();
                        handleClose()
                    }}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalDelete;
