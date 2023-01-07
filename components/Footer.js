import { Container, Row } from "react-bootstrap";

function Footer() {
  return (
    <div className="bg-dark text-light py-3">
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
            Icons created by Freepik and Kiranshastry - Flaticon
          </a>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
