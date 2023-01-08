import { useRouter } from "next/router";
import { Spinner, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { DateTime } from "luxon";

import Layout from "../../components/Layout";

import { useTransaction } from "../../utils/data";

export default function TransactionPage() {
  const router = useRouter();
  const { transactionId } = router.query;
  const { transaction, error, loading } = useTransaction(transactionId);
  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <Layout>
        <Card>
          <Card.Header>Transaction Details</Card.Header>
          <ListGroup variant="flush">
            <ListGroupItem>
              <span className="fw-bolder">Title:</span> {transaction.title}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Description:</span>{" "}
              {transaction.description}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Date:</span>{" "}
              {DateTime.fromISO(transaction.date).toLocaleString(
                DateTime.DATE_MED
              )}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Price:</span>{" "}
              {transaction.price.toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Split:</span>{" "}
              {transaction.split.toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Category:</span>{" "}
              {transaction.category}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Payer:</span>{" "}
              {transaction.payer.email} (
              <span>
                {transaction.includePayerInSplit
                  ? "Included in the split"
                  : "Excluded from the split"}
                )
              </span>
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Users:</span>{" "}
              {transaction.users.map((user) => user.email).join(", ")}
            </ListGroupItem>
            <ListGroupItem>
              <span className="fw-bolder">Creator:</span>{" "}
              {transaction.creator.email}
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Layout>
    );
  }
}
