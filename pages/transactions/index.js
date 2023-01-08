import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

import Layout from "../../components/Layout";
import { useTransactions } from "../../utils/data";

export default function TransactionPage() {
  const { transactions, loading, error } = useTransactions();

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return <Layout></Layout>;
  }
}
