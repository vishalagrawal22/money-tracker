import FriendRequest from "../../../../models/FriendRequest";
import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleCreateFriendRequest(req, res) {
  const uid = await getUserId(req);
  const email = req.body.email;

  const sender = await User.findOne({ uid });
  const receiver = await User.findOne({ email });

  if (!receiver) {
    res.status(404).json({
      ok: false,
      message: "email not found",
    });
    return;
  }

  if (sender._id.equals(receiver._id)) {
    res.status(400).json({
      ok: false,
      message: "can not send friend request to self",
    });
    return;
  }

  const existingRequest = await FriendRequest.findOne({
    receiverID: receiver._id,
    senderID: sender._id,
  });

  if (existingRequest) {
    res.status(400).json({
      ok: false,
      message: "friend request already sent",
    });
    return;
  }

  const friendRequest = new FriendRequest({
    receiverID: receiver._id,
    senderID: sender._id,
  });

  await friendRequest.save();

  res.status(201).json({
    ok: true,
    message: "friend request sent",
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "POST":
        await handleCreateFriendRequest(req, res);
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
        error,
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
