import Link from "next/link";
import { DateTime } from "luxon";
import { Card, Button } from "react-bootstrap";

import { useUser } from "../utils/auth/client";

import { checkUidInArray } from "../utils/helpers";

export default function TransactionCard({ transaction }) {
  const { user } = useUser();
  return (
    <Card className="mb-4">
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="mb-3">{transaction.title}</Card.Title>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-md-3">
          <Card.Text className="me-3">
            <span className="fw-bolder">Catogery:</span> {transaction.category}
          </Card.Text>
          <Card.Text>
            <span className="fw-bolder">Split:</span>{" "}
            {transaction.split ? transaction.split.toFixed(2) : NaN}{" "}
            <span>
              (
              {checkUidInArray(user.uid, transaction["users"]) &&
              (transaction.payer.uid !== user.uid ||
                transaction.includePayerInSplit)
                ? "Included"
                : "Excluded"}
              )
            </span>
          </Card.Text>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
          <Card.Text className="me-3">
            <span className="fw-bolder">Payer:</span> {transaction.payer.email}
          </Card.Text>
          <Card.Text>
            <span className="fw-bolder">Date:</span>{" "}
            {DateTime.fromISO(transaction.date).toLocaleString(
              DateTime.DATE_MED
            )}
          </Card.Text>
        </div>
        <Card.Text className="mb-3">{transaction.description}</Card.Text>
        <Link
          className="align-self-center"
          href={`/transactions/${transaction._id}`}
        >
          <Button variant="secondary" active>
            Read more
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
