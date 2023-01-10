import { Card, Row, Spinner } from "react-bootstrap";

import { useBudget, useSpent } from "../utils/data";
import Budget from "./Budget";

function UserData() {
  const { budget, loading: budgetLoading, error: budgetError } = useBudget();
  const { spent, loading: spentLoading, error: spentError } = useSpent();

  const remaining = budget - spent;

  if (budgetLoading || spentLoading) {
    return <Spinner className="m-4" />;
  } else if (budgetError || spentError) {
    return (
      <div className="m-4">{budgetError.message || spentError.message}</div>
    );
  } else {
    return (
      <Card className="p-4">
        <Card.Title>Spending Details</Card.Title>
        <Card.Body>
          <Row className="mb-3">
            <Budget budget={budget} />
          </Row>
          <Row className="mb-3">
            <Card.Text>Spent: {spent}</Card.Text>
          </Row>
          <Row>
            <Card.Text>
              {remaining >= 0 ? (
                <div className="text-success">
                  Remaining Budget: {remaining}
                </div>
              ) : (
                <div className="text-danger">
                  Amount Above Budget: {Math.abs(remaining)}
                </div>
              )}
            </Card.Text>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default UserData;
