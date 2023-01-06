import { Container, Row } from "react-bootstrap";

function Footer() {
  return (
    <div
      className="bg-dark text-light py-3"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
      }}
    >
      <Container>
        <Row>
          <span className="m-auto w-auto">
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/vishal-agrawal-9390861ba/"
              title="linkedin profile"
            >
              Vishal Agrawal
            </a>
          </span>
        </Row>
        <Row>
          <a
            className="m-auto w-auto"
            href="https://www.flaticon.com/free-icons/money"
            title="money icons"
          >
            Money icons created by Freepik - Flaticon
          </a>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
