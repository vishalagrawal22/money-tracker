import { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormLabel,
  InputGroup,
} from "react-bootstrap";
import { mutate } from "swr";

import { putAsUser } from "../utils/data";

function Budget({ budget }) {
  const [editing, setEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  async function handleSubmit(e) {
    e.preventDefault();
    await putAsUser("/api/v1/currentuser", {
      budget: newBudget,
    });
    mutate("/api/v1/currentuser");
    setEditing(false);
  }

  function handleChange(e) {
    setNewBudget(e.target.value);
  }

  function handleEdit() {
    setEditing(true);
  }

  return (
    <div className="mx-auto d-inline-flex align-items-center">
      {editing ? (
        <Form className="d-flex" onSubmit={handleSubmit}>
          <InputGroup className="me-3 d-flex align-items-center">
            <FormLabel className="me-3 mb-0">Update Budget:</FormLabel>
            <FormControl
              type="number"
              value={newBudget}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <Button variant="primary" type="submit" active>
            Save
          </Button>
        </Form>
      ) : (
        <>
          <div className="me-3">Current Budget: {budget}</div>
          <Button variant="secondary" onClick={handleEdit} active>
            Edit
          </Button>
        </>
      )}
    </div>
  );
}

export default Budget;
