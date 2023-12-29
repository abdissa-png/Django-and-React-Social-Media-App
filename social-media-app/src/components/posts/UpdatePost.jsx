import React, { useState,useContext } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { Context } from "../Layout";

function UpdatePost(props) {
  const [show,setShow]=useState(false)
  const handleShow=()=>setShow(true)
  const handleClose=()=>setShow(false)
  const { post, refresh } = props;
  const {toaster,setToaster}=useContext(Context)
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({
    author: post.author.id,
    body: post.body,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatePostForm = event.currentTarget;

    if (updatePostForm.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const data = {
      author: form.author,
      body: form.body,
    };

    axiosService
      .put(`/post/${post.id}/`, data)
      .then(() => {
        handleClose();
        setToaster({
            title:"Update Post",
            message:"Post edited 🚀",
            show:true,
            type:"success"
          })
        refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Dropdown.Item onClick={handleShow}>Modify</Dropdown.Item>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Update Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                name="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Modify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdatePost;