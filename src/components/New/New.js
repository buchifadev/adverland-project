import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const New = ({ newAd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const nav = useNavigate();

  const submitAdvert = async () => {
    await newAd(title, description, image);
    nav("/");
  };

  return (
    <>
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Add new advert to the blockchain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="form"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flexStart",
              flexDirection: "column",
              fontFamily: "Josefin Sans",
            }}
          >
            <div className="lbl">Advert Title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="lbl">Advert Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="lbl">Advert Image</div>
            <input value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => nav("/")}>
            Exit
          </Button>
          <Button variant="primary" onClick={() => submitAdvert()}>
            Submit draft
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default New;
