import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";

import { useFriendRequests } from "../utils/data";

import FriendRequest from "./FriendRequest";

function FriendRequestList() {
  const { friendRequests, loading, error } = useFriendRequests();
  if (loading) {
    return <Spinner className="m-4" />;
  } else if (error) {
    return <div className="m-4">{error.message}</div>;
  } else {
    return (
      <>
        {friendRequests.length === 0 && (
          <div className="mt-3">There are no friend requests.</div>
        )}
        <ListGroup as="ul" className="mt-3">
          {friendRequests.map((friendRequest) => (
            <FriendRequest
              key={friendRequest._id}
              friendRequest={friendRequest}
            />
          ))}
        </ListGroup>
      </>
    );
  }
}

export default FriendRequestList;
