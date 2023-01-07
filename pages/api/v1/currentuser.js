import User from "../../../models/User";
import { getUserId, UNAUTHENTICATED_ERROR } from "../../../utils/auth/server";
import { connect } from "../../../utils/db";

async function handleRetrieveCurrentUser(req, res) {
  const uid = await getUserId(req);
  const currentUser = await User.findOne({ uid });

  res.status(200).json({
    ok: true,
    message: "successfully retrieved user",
    currentUser: currentUser.toObject(),
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "GET":
        await handleRetrieveCurrentUser(req, res);
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
