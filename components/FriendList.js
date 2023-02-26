import { useMemo } from "react";
import { Table, Spinner } from "react-bootstrap";

import { useFriends, useTransactions } from "../utils/data";
import { useUser } from "../utils/auth/client";

import Friend from "./Friend";

function FriendList() {
  const { user: currentUser } = useUser();
  const {
    friends,
    loading: friendsLoading,
    error: friendsError,
  } = useFriends();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();

  const payments = useMemo(() => {
    const payments = new Map();

    function addAmount(userId, amount, type) {
      if (!(userId in payments)) {
        payments[userId] = {
          receive: 0,
          pay: 0,
        };
      }
      payments[userId][type] += amount;
    }

    transactions.forEach((transaction) => {
      if (transaction.payer.uid === currentUser.uid) {
        for (const user of transaction.users) {
          if (user.uid === currentUser.uid) continue;

          addAmount(user._id, transaction.split, "receive");
        }
      } else {
        addAmount(transaction.payer._id, transaction.split, "pay");
      }
    });

    return payments;
  }, [transactions, currentUser]);

  if (friendsLoading || transactionsLoading) {
    return <Spinner className="m-4" />;
  } else if (friendsError || transactionsError) {
    return (
      <div className="m-4">
        {friendsError.message || transactionsError.message}
      </div>
    );
  } else {
    return (
      <>
        <h5 className="fs-5 mt-4 fw-bold">Friend List</h5>
        {friends.length === 0 && (
          <div className="mt-2">There are no friends.</div>
        )}
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Email</th>
              <th>Need to receive</th>
              <th>Need to pay</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => {
              return (
                <Friend
                  friend={friend}
                  payment={payments[friend._id]}
                  key={friend._id}
                />
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

export default FriendList;
