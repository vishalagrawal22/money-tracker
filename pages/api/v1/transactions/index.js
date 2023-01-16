import Transaction from "../../../../models/Transaction";
import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

async function handleCreateTransaction(req, res) {
  const uid = await getUserId(req);
  const creator = await User.findOne({ uid });

  if (!creator) {
    res.status(400).json({
      ok: false,
      message: "creator not found",
    });
    return;
  }

  const transaction = new Transaction({
    ...req.body,
    creator: creator._id,
  });
  await transaction.save();

  res.status(201).json({
    ok: true,
    message: "transaction created",
  });
}

async function handleRetrieveTransactions(req, res) {
  const uid = await getUserId(req);
  const user = await User.findOne({ uid });

  if (!user) {
    res.status(400).json({
      ok: false,
      message: "user not found",
    });
    return;
  }

  const transactionDocs = await Transaction.find({
    $or: [{ users: user._id }, { creator: user._id }],
  })
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

  const transactions = transactionDocs.map((transaction) =>
    transaction.toObject({ virtuals: true })
  );

  res.status(200).json({
    ok: true,
    message: "successfully retrieved all transactions",
    transactions,
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "POST":
        await handleCreateTransaction(req, res);
        break;
      case "GET":
        await handleRetrieveTransactions(req, res);
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
