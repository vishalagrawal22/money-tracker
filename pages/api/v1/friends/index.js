import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleRetrieveFriends(req, res) {
  const userId = await getUserId(req);
  const user = await User.findOne({ uid: userId }).populate("friends").exec();

  if (!user) {
    res.status(404).json({
      ok: false,
      message: "user not found",
    });
    return;
  }

  const friends = user["friends"].map((friend) => friend.toObject());

  res.status(200).json({
    ok: true,
    message: "successfully retrieved all friends",
    friends,
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "GET":
        await handleRetrieveFriends(req, res);
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
