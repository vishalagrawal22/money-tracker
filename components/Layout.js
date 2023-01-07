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
        <main className="p-4 flex-grow-1 d-flex justify-content-center">
          <div
            style={{
              minWidth: "40%",
            }}
          >
            {children}
          </div>
        </main>
        <Footer />
      </>
    );
  }
}

export default Layout;
