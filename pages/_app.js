import Head from "next/head";

import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useUser } from "../utils/auth/client";

export default function App({ Component, pageProps }) {
  const { loading, error } = useUser();

  if (loading) {
    return (
      <div className="m-4 spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <>
        <Head>
          <title>Money Tracker</title>
          <meta name="description" content="An app to monitor your spending" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}
