import Link from "next/link";
import { DateTime } from "luxon";
import { mutate } from "swr";
import { Card, Button } from "react-bootstrap";

import { putAsUser } from "../utils/data";
import { checkUidInArray } from "../utils/helpers";

function checkCanCurrentUserCanVote(transaction, currentUserId) {
  return transaction.users.some((user) => user._id === currentUserId);
}

function checkIfCurrentUserAlreadyVoted(transaction, currentUserId) {
  // Check if current user's ID is present in the approvals array
  const approved = transaction.approvals.find(
    (userId) => userId === currentUserId
  );

  // Check if current user's ID is present in the rejections array
  const rejected = transaction.rejections.find(
    (userId) => userId === currentUserId
  );

  // If either approved or rejected is not undefined, then the current user has already voted
  if (approved || rejected) {
    return true;
  }

  // Otherwise, the current user has not yet voted
  return false;
}

function getCurrentUserVote(transaction, currentUserId) {
  const approved = transaction.approvals.find(
    (userId) => userId === currentUserId
  );
  if (approved) {
    return "approved";
  }

  const rejected = transaction.rejections.find(
    (userId) => userId === currentUserId
  );
  if (rejected) {
    return "rejected";
  }

  return "user has not voted";
}

export default function TransactionCard({ currentUser, transaction }) {
  async function updateTransactionApprovalStatus(action) {
    await putAsUser(`/api/v1/transactions/${transaction._id}`, {
      action,
    });
    mutate("/api/v1/transactions");
    mutate(`/api/v1/transactions/${transaction._id}`);
  }

  const canCurrentUserVote = checkCanCurrentUserCanVote(
    transaction,
    currentUser._id
  );

  const currentUserAlreadyVoted = checkIfCurrentUserAlreadyVoted(
    transaction,
    currentUser._id
  );

  const renderActionButtons = canCurrentUserVote && !currentUserAlreadyVoted;

  const userVote = getCurrentUserVote(transaction, currentUser._id);

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
              {checkUidInArray(currentUser.uid, transaction["users"]) &&
              (transaction.payer.uid !== currentUser.uid ||
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
        {renderActionButtons ? (
          <div className="d-flex justify-content-center">
            <Button
              variant="success"
              className="mr-3"
              active
              onClick={() => {
                updateTransactionApprovalStatus("approve");
              }}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              active
              onClick={() => {
                updateTransactionApprovalStatus("reject");
              }}
            >
              Reject
            </Button>
          </div>
        ) : (
          <>
            {currentUserAlreadyVoted && userVote !== "user has not voted" && (
              <div className="text-center mb-3 fw-semibold">
                You have {userVote} this transaction
              </div>
            )}

            {!canCurrentUserVote && (
              <div className="text-center mb-3 fw-semibold">
                You cannot vote on this transaction because you are not listed
                as a user
              </div>
            )}
            <Link
              className="align-self-center"
              href={`/transactions/${transaction._id}`}
            >
              <Button variant="secondary" active>
                Read more
              </Button>
            </Link>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
