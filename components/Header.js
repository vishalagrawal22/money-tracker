import { useRouter } from "next/router";
import Link from "next/link";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { logout, useUser } from "../utils/auth/client";

function Header() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <Navbar bg="light" expand="lg">
      <Container className="ms-0 me-0 mw-100 justify-content-start">
        <Navbar.Brand>
          <Link href="/" className="text-decoration-none text-reset">
            Money Tracker
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle className="ms-auto" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link
              href="/transactions"
              role="button"
              className={`nav-link ${
                router.pathname === "/transactions" ? "active" : ""
              }`}
            >
              Transactions
            </Link>
            <Link
              href="/friends"
              role="button"
              className={`nav-link ${
                router.pathname === "/friends" ? "active" : ""
              }`}
            >
              Friends
            </Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="pe-4">
            Signed in as {user.email || ""}
          </Navbar.Text>
          <Button variant="secondary" active onClick={logout}>
            logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
