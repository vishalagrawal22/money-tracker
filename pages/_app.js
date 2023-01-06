import "../styles/globals.css";

import { useUser } from "../utils/auth/client";

export default function App({ Component, pageProps }) {
  const { loading, error } = useUser();

  if (loading) {
    return <div className="m-4">Loading...</div>;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return <Component {...pageProps} />;
  }
}
