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
      <Form
        className="d-flex flex-column flex-md-row justify-content-center align-items-center"
        onSubmit={handleSubmit}
      >
        <FormControl
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter email"
          className="mb-4 mb-md-0 me-md-4"
        />
        <Button variant="primary" type="submit" active>
          Send Friend Request
        </Button>
      </Form>
      {message !== "" && (
        <Alert className="mt-3" variant={isError ? "danger" : "success"}>
          {message}
        </Alert>
      )}
    </>
  );
}

export default FriendRequestForm;
