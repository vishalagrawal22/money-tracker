import { useState } from "react";

import { postAsUser } from "../utils/data";
import { Form, FormControl, Button, Alert } from "react-bootstrap";

function FriendRequestForm() {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    const data = await postAsUser("/api/v1/friendrequests", {
      email,
    });

    if (!data.ok) {
      setIsError(true);
    }
    setMessage(data.message);
  }

  function handleChange(event) {
    setEmail(event.target.value);
    setMessage("");
    setIsError(false);
  }

  return (
    <>
      <Form className="d-flex w-50 align-items-center" onSubmit={handleSubmit}>
        <Form.Group
          className="d-flex flex-grow-1 align-items-center"
          controlId="formEmail"
        >
          <Form.Label className="fs-5 text-nowrap mr-4">
            Email address
          </Form.Label>
          <FormControl
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter email"
            className="flex-grow-1 mr-4"
          />
        </Form.Group>
        <Button variant="primary" type="submit" active>
          Send Friend Request
        </Button>
      </Form>
      {message !== "" && (
        <Alert className="w-50 mt-4" variant={isError ? "danger" : "success"}>
          {message}
        </Alert>
      )}
    </>
  );
}

export default FriendRequestForm;
