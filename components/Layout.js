import { useRouter } from "next/router";

import { useUser } from "../utils/auth/client";

import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }) {
  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    router.push("/login");
  } else {
    return (
      <>
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
      </>
    );
  }
}

export default Layout;
