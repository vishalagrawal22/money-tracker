import FriendRequest from "../../../../models/FriendRequest";
import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleUpdateFriendRequest(req, res) {
  const { requestId } = req.query;
  console.log(requestId);
  const friendRequest = await FriendRequest.findById(requestId);
  console.log(friendRequest);
  if (!friendRequest) {
    res.status(404).json({
      ok: false,
      message: "friend request not found!",
    });
    return;
  }

  const userId = await getUserId(req);
  const receiver = await User.findOne({ uid: userId });

  if (!friendRequest.receiver._id.equals(receiver._id)) {
    res.status(400).json({
      ok: false,
      message: "friend request can only be updated by receiver",
    });
    return;
  }

  let message;
  if (req.body.accept) {
    message = "friend request accepted";
    const sender = await User.findById(friendRequest.sender._id);

    receiver["friends"].push(friendRequest.sender._id);
    sender["friends"].push(friendRequest.receiver._id);

    receiver.save();
    sender.save();
  } else {
    message = "friend request rejected";
  }

  await friendRequest.remove();
  res.status(200).json({
    ok: true,
    message,
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "PUT":
        await handleUpdateFriendRequest(req, res);
        break;
      default:
        res.status(405).json({
          ok: false,
          message: "Method not allowed",
        });
        break;
    }
  } catch (error) {
    if (error === UNAUTHENTICATED_ERROR) {
      res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    } else {
      res.status(500).json({
        ok: false,
        message: "Internal server error",
        error,
      });
    }
  }
}
