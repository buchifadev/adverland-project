import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Fund = ({ fundAd, adIndex }) => {
  const [amount, setAmount] = useState(1);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Fund
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Fund your advert here</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flexStart",
              flexDirection: "column",
              fontFamily: "Josefin Sans",
            }}
          >
            <div>How much would you like to fund advert with (in Celo)</div>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => fundAd(adIndex, amount)}
          >
            Fund
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Fund;
