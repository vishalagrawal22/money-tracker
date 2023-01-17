import { useState } from "react";
import { Spinner, ListGroup, Button } from "react-bootstrap";

import { useCurrentUser, useTransactions } from "../utils/data";

import TransactionCard from "./TransactionCard";
import TransactionFilterForm from "./TransactionFilterForm";

function TransactionList() {
  const {
    currentUser,
    loading: currentUserLoading,
    error: currentUserError,
  } = useCurrentUser();

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();

  const [filters, setFilters] = useState({
    category: null,
    startDate: "",
    endDate: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterChange(filters) {
    setFilters(filters);
  }

  function getCategories() {
    const categories = transactions
      .map((transaction) => ({
        label: transaction.category,
        value: transaction.category,
      }))
      .reduce((categories, category) => {
        const x = categories.find(
          (currentCategory) => currentCategory["value"] === category["value"]
        );
        if (!x) {
          return categories.concat([category]);
        } else {
          return categories;
        }
      }, [])
      .sort(function (firstCategory, secondCategory) {
        if (firstCategory["value"] < secondCategory["value"]) {
          return -1;
        } else if (firstCategory["value"] > secondCategory["value"]) {
          return 1;
        } else {
          return 0;
        }
      });
    return categories;
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

  if (currentUserLoading || transactionsLoading) {
    return <Spinner className="m-4" />;
  } else if (currentUserError || transactionsError) {
    return (
      <div className="m-4">
        {currentUserError.message || transactionsError.message}
      </div>
    );
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
            categories={getCategories()}
            onFilter={handleFilterChange}
          />
        )}
        {getFilteredTransactions().length === 0 && (
          <div>There are no transactions.</div>
        )}
        <ListGroup as="ul" className="mt-4">
          {getFilteredTransactions().map((transaction) => (
            <TransactionCard
              key={transaction._id}
              currentUser={currentUser}
              transaction={transaction}
            />
          ))}
        </ListGroup>
      </>
    );
  }
}

export default TransactionList;
