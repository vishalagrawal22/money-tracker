import { NextAdapter } from "next-query-params";
import { QueryParamProvider } from "use-query-params";
import Head from "next/head";
import Spinner from "react-bootstrap/Spinner";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

import { useUser } from "../utils/auth/client";

export default function App({ Component, pageProps }) {
  const { loading, error } = useUser();

  if (loading) {
    return <Spinner className="m-4" />;
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
        <QueryParamProvider adapter={NextAdapter}>
          <Component {...pageProps} />
        </QueryParamProvider>
      </>
    );
  }
}
