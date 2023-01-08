import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";

import { useTransactions } from "../utils/data";

import TransactionCard from "./TransactionCard";

function TransactionList() {
  const { transactions, loading, error } = useTransactions();
  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <>
        <h5 className="fs-5 mt-4 fw-bold">Transactions</h5>
        {transactions.length === 0 && (
          <div className="mt-2">There are no transactions.</div>
        )}
        <ListGroup as="ul" className="mt-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </ListGroup>
      </>
    );
  }
}

export default TransactionList;
