import { useState } from "react";
import { Spinner, ListGroup, Button, ButtonGroup } from "react-bootstrap";

import { useCurrentUser, useTransactions } from "../utils/data";
import { capitalize } from "../utils/helpers";

import TransactionCard from "./TransactionCard";
import TransactionFilterForm from "./TransactionFilterForm";

function TypeFilterButton({ onFilter, activeType, type }) {
  return (
    <Button
      variant="secondary"
      className={`text-gray-500 ${activeType === type ? "text-white" : ""}`}
      onClick={() =>
        onFilter({
          type,
        })
      }
      active={activeType === type}
    >
      {capitalize(type)}
    </Button>
  );
}

function TypeFilterButtonGroup({ onFilter, activeType }) {
  return (
    <div className="d-flex flex-column align-items-center">
      <ButtonGroup>
        <TypeFilterButton
          onFilter={onFilter}
          activeType={activeType}
          type="all"
        />
        <TypeFilterButton
          onFilter={onFilter}
          activeType={activeType}
          type="pending"
        />
        <TypeFilterButton
          onFilter={onFilter}
          activeType={activeType}
          type="approved"
        />
        <TypeFilterButton
          onFilter={onFilter}
          activeType={activeType}
          type="rejected"
        />
      </ButtonGroup>
    </div>
  );
}

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
    type: "all",
    category: null,
    startDate: "",
    endDate: "",
  });

  const [showFilter, setShowFilter] = useState(false);

  function handleFilterChange(newFilters) {
    setFilters({ newFilters, ...newFilters });
  }

  function getCategories() {
    const categories = transactions
      .map((transaction) => ({
        label: transaction.category,
        value: transaction.category,
      }))
      .reduce((categories, category) => {
        const categoryAlreadyPresent = categories.find(
          (currentCategory) => currentCategory["value"] === category["value"]
        );

        if (!categoryAlreadyPresent) {
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
    const { type, category, startDate, endDate } = filters;
    let filteredTransactions = transactions
      .filter((transaction) => !category || transaction.category === category)
      .filter(
        (transaction) =>
          !startDate || new Date(startDate) <= new Date(transaction.date)
      )
      .filter(
        (transaction) =>
          !endDate || new Date(transaction.date) <= new Date(endDate)
      );

    if (type === "approved") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.approvals.length === transaction.users.length &&
          transaction.rejections.length === 0
      );
    } else if (type === "rejected") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.rejections.length > 0
      );
    } else if (type === "pending") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.approvals.length !== transaction.users.length &&
          transaction.rejections.length === 0
      );
    }

    return filteredTransactions;
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

        <TypeFilterButtonGroup
          onFilter={handleFilterChange}
          activeType={filters.type}
        />

        {getFilteredTransactions().length === 0 && (
          <div className="mt-3">There are no transactions.</div>
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
