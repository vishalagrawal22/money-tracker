import User from "../../../../models/User";

import {
  getUserData,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleAddUser(req, res) {
  const userData = await getUserData(req);

  const user = new User(userData);
  await user.save();

  res.status(201).json({
    ok: true,
    message: "user created",
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "POST":
        await handleAddUser(req, res);
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
