import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { logout, useUser } from "../utils/auth/client";

function Header() {
  const { user } = useUser();
  return (
    <Navbar bg="light" expand="lg">
      <Container className="ms-0 me-0 mw-100 justify-content-start">
        <Navbar.Brand href="/">Money Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/transactions">Transactions</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="m-2">
            Signed in as {user.displayName || user.email || ""}
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
