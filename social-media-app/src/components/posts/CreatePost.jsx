import React, { useState,useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import { Context } from "../Layout";

const CreatePost = (props) => {
  const [form,setForm]=useState({
    author:'',
    body:''
  })
  const [show,setShow]=useState(false)
  const handleShow=()=>setShow(true)
  const handleClose=()=>setShow(false)
  const {toaster,setToaster}=useContext(Context)
  const [validated, setValidated] = useState(false);
  const user = getUser();
  const { refresh } = props;
  const handleSubmit = (event) => {
    event.preventDefault();
    const createPostForm = event.currentTarget;
    if (createPostForm.checkValidity() == false) {
      event.stopPropagation();
    }
    setValidated(true);
    const data = {
      author: user.id,
      body: form.body,
    };
    axiosService
      .post("/post/", data)
      .then((res) => {
        handleClose();
        setToaster({
          title:"New Post",
          message:"Post created 🚀",
          show:true,
          type:"success"
        })
        refresh()
      })
      .catch((err) => {
        setToaster({
          title:"Error",
          message:"An error occured",
          show:true,
          type:"danger"
        })
      });
  };
  return (
    <>
      <Form.Group className="my-3 w-75">
        {/* rounded-pill */}
        <Form.Control
          className="py-2 rounded-pill border-primary text-primary"
          type="text"
          placeholder="Write a post"
          onClick={handleShow}
        ></Form.Control>
      </Form.Group>

      <Modal show={show} onHide={handleClose}>
        {/* closeButton to create a close button */}
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Create a Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              {/* name property for control(input) field 
                            as allows to set it as text field
                            rows num of rows
                            */}
              <Form.Control
                name="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                as="textarea"
                rows={3}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={form.body === undefined}
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreatePost;
