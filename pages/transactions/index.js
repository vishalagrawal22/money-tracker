import Link from "next/link";
import { Button } from "react-bootstrap";

import Layout from "../../components/Layout";
import TransactionList from "../../components/TransactionList";

export default function TransactionPage() {
  return (
    <Layout>
      <Link href="/transactions/create">
        <Button variant="primary" active>
          Create Transaction
        </Button>
      </Link>
      <TransactionList />
    </Layout>
  );
}
