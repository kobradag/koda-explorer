import { Button, Modal } from "react-bootstrap";


const BalanceModal = (props) => {
    return (
    <>
      <Modal size="lg" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>KODA Balance from REST-API</Modal.Title>
        </Modal.Header>
        <Modal.Body>The $KODA balance for <br />{props.address} is:<br />
        <b>{props.balance} KODA</b></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
}

export default BalanceModal;
