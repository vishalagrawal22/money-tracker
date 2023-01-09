import { useState } from "react";
import { Spinner, ListGroup, Button } from "react-bootstrap";

import { useTransactions } from "../utils/data";

import TransactionCard from "./TransactionCard";
import TransactionFilterForm from "./TransactionFilterForm";

function TransactionList() {
  const { transactions, loading, error } = useTransactions();
  const [filters, setFilters] = useState({
    category: null,
    startDate: "",
    endDate: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterChange(filters) {
    console.log(filters);
    setFilters(filters);
  }

  function getFilteredTransactions() {
    const { category, startDate, endDate } = filters;
    return transactions
      .filter((transaction) => !category || transaction.category === category)
      .filter(
        (transaction) =>
          !startDate || new Date(startDate) <= new Date(transaction.date)
      )
      .filter(
        (transaction) =>
          !endDate || new Date(transaction.date) <= new Date(endDate)
      );
  }

  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <>
        <h5 className="fs-5 my-3 fw-bold">Transactions</h5>
        <Button
          className="mb-3"
          variant="outline-dark"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? "Hide Filter" : "Show Filter"}
        </Button>
        {showFilter && (
          <TransactionFilterForm
            categories={transactions.map((transaction) => ({
              label: transaction.category,
              value: transaction.category,
            }))}
            onFilter={handleFilterChange}
          />
        )}
        {getFilteredTransactions().length === 0 && (
          <div>There are no transactions.</div>
        )}
        <ListGroup as="ul" className="mt-4">
          {getFilteredTransactions().map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </ListGroup>
      </>
    );
  }
}

export default TransactionList;
