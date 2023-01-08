import Transaction from "../../../../models/Transaction";
import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleRetrieveTransaction(req, res) {
  const { transactionId } = req.query;
  const transaction = await Transaction.findById(transactionId)
    .populate("users", {
      uid: 1,
      email: 1,
    })
    .populate("payer", {
      uid: 1,
      email: 1,
    })
    .populate("creator", {
      uid: 1,
      email: 1,
    })
    .exec();

  if (!transaction) {
    res.status(404).json({
      ok: false,
      message: "transaction not found",
    });
    return;
  }

  const uid = await getUserId(req);
  const user = await User.findOne({ uid });

  let inUser = false;
  for (const memberId of transaction["users"]) {
    if (user._id.equals(memberId)) {
      inUser = true;
    }
  }

  if (!(user._id.equals(transaction.creator._id) || inUser)) {
    res.status(400).json({
      ok: false,
      message: "transaction can be viewed by users or creator only",
    });
    return;
  }

  res.status(200).json({
    ok: true,
    message: "successfully retrieved transaction",
    transaction: transaction.toObject({ virtuals: true }),
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "GET":
        await handleRetrieveTransaction(req, res);
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
