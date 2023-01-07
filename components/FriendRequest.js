import Image from "next/image";
import ListGroup from "react-bootstrap/ListGroup";
import { mutate } from "swr";

import { putAsUser } from "../utils/data";

function FriendRequest({ friendRequest }) {
  async function handleRequestAction(accept) {
    await putAsUser(`/api/v1/friendrequests/${friendRequest._id}`, {
      accept,
    });
    mutate("/api/v1/friendrequests");
    if (accept) {
      mutate("/api/v1/friends");
    }
  }

  return (
    <ListGroup.Item
      as="li"
      className="d-flex align-items-center justify-content-between"
    >
      <div className="w-100 align-items-center d-flex ms-2">
        <div>{friendRequest.sender.email}</div>
        <div className="d-flex ms-auto">
          <Image
            src="/accept.png"
            className="me-2"
            alt="accept"
            width={30}
            height={30}
            onClick={() => handleRequestAction(true)}
          />
          <Image
            src="/reject.png"
            alt="reject"
            width={30}
            height={30}
            onClick={() => handleRequestAction(false)}
          />
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default FriendRequest;
