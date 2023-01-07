import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";

import { useFriends } from "../utils/data";

import Friend from "./Friend";

function FriendList() {
  const { friends, loading, error } = useFriends();
  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <>
        <h5 className="fs-5 mt-4 fw-bold">Friend List</h5>
        {friends.length === 0 && (
          <div className="mt-2">There are no friends.</div>
        )}
        <ListGroup as="ul" className="mt-4">
          {friends.map((friend) => (
            <Friend key={friend._id} friend={friend} />
          ))}
        </ListGroup>
      </>
    );
  }
}

export default FriendList;
