import { useRouter } from "next/router";
import { DateTime } from "luxon";
import { mutate } from "swr";
import { Card, Button, ButtonGroup } from "react-bootstrap";

import { getTransactionStatus, putAsUser } from "../utils/data";
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
    (user) => user._id === currentUserId
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
    (user) => user._id === currentUserId
  );

  if (rejected) {
    return "rejected";
  }

  return "user has not voted";
}

function getRejectionUserEmailList(transaction, currentUser) {
  return transaction.rejections.map((rejection) =>
    rejection.uid === currentUser.uid ? "You" : rejection.email
  );
}

export default function TransactionCard({ currentUser, transaction }) {
  const router = useRouter();

  const canCurrentUserVote = checkCanCurrentUserCanVote(
    transaction,
    currentUser._id
  );

  const currentUserAlreadyVoted = checkIfCurrentUserAlreadyVoted(
    transaction,
    currentUser._id
  );

  const userVote = getCurrentUserVote(transaction, currentUser._id);
  const transactionStatus = getTransactionStatus(transaction);

  async function updateTransactionApprovalStatus(action) {
    await putAsUser(`/api/v1/transactions/${transaction._id}`, {
      action,
    });
    mutate("/api/v1/transactions");
    mutate(`/api/v1/transactions/${transaction._id}`);
  }

  const renderActionButtons = canCurrentUserVote && !currentUserAlreadyVoted;

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

        {!canCurrentUserVote ? (
          <div className="text-center fw-semibold">
            You cannot vote on this transaction because you are not listed as a
            user
          </div>
        ) : (
          currentUserAlreadyVoted &&
          userVote === "approved" && (
            <div className="text-center fw-semibold">
              You have {userVote} this transaction
            </div>
          )
        )}

        {transactionStatus === "rejected" && (
          <div className="text-center fw-semibold">
            Rejected by{" "}
            {getRejectionUserEmailList(transaction, currentUser).join(", ")}
          </div>
        )}

        <Button
          className="mx-auto mb-3"
          variant="secondary"
          onClick={() => {
            router.push(`/transactions/${transaction._id}`);
          }}
          active
        >
          Read more
        </Button>

        {renderActionButtons && (
          <div className="d-flex justify-content-center align-items-center">
            <ButtonGroup className="w-1/2">
              <Button
                variant="success"
                onClick={() => updateTransactionApprovalStatus("approved")}
                active
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() => updateTransactionApprovalStatus("rejected")}
                active
              >
                Reject
              </Button>
            </ButtonGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
