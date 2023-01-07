import ListGroup from "react-bootstrap/ListGroup";

function Friend({ friend }) {
  return (
    <ListGroup.Item
      as="li"
      className="d-flex align-items-center justify-content-between"
    >
      <div className="w-100 align-items-center d-flex ms-2">
        <div>{friend.email}</div>
      </div>
    </ListGroup.Item>
  );
}

export default Friend;
