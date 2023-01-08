import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import { DateTime } from "luxon";

import Layout from "../../../components/Layout";
import TransactionForm from "../../../components/TransactionForm";
import { useTransaction } from "../../../utils/data";

export default function TransactionUpdatePage() {
  const router = useRouter();
  const { transactionId } = router.query;
  const { transaction, error, loading } = useTransaction(transactionId);

  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    const { users, payer, date, ...transactionFormData } = transaction;
    transactionFormData.users = users.map((user) => ({
      value: user._id,
      label: user.email,
    }));

    transactionFormData.payer = {
      value: payer._id,
      label: payer.email,
    };

    transactionFormData.date = DateTime.fromISO(date).toFormat("yyyy-MM-dd");

    return (
      <Layout>
        <TransactionForm transaction={transactionFormData} />
      </Layout>
    );
  }
}
