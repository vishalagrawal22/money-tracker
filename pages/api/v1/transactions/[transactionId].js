import Transaction from "../../../../models/Transaction";
import User from "../../../../models/User";

import {
  getUserId,
  UNAUTHENTICATED_ERROR,
} from "../../../../utils/auth/server";
import { connect } from "../../../../utils/db";

import { checkObjectIdInArray } from "../../../../utils/helpers";

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

  if (
    !(
      user._id.equals(transaction.creator._id) ||
      checkObjectIdInArray(user._id, transaction.users)
    )
  ) {
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

async function handleDeleteTransaction(req, res) {
  const { transactionId } = req.query;
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    res.status(404).json({
      ok: false,
      message: "transaction not found",
    });
    return;
  }

  const uid = await getUserId(req);
  const user = await User.findOne({ uid });

  if (!user) {
    res.status(400).json({
      ok: false,
      message: "user not found",
    });
    return;
  }

  if (!user._id.equals(transaction.creator)) {
    res.status(400).json({
      ok: false,
      message: "transaction can be deleted only by creator",
    });
    return;
  }

  await transaction.remove();

  res.status(200).json({
    ok: true,
    message: "successfully deleted transaction",
  });
}

async function handleUpdateTransaction(req, res) {
  const { transactionId } = req.query;
  const oldTransaction = await Transaction.findById(transactionId, {
    creator: true,
    users: true,
    approvals: true,
    rejections: true,
  });

  if (!oldTransaction) {
    res.status(404).json({
      ok: false,
      message: "transaction not found",
    });
    return;
  }

  const uid = await getUserId(req);
  const user = await User.findOne({ uid });

  if (!user) {
    res.status(400).json({
      ok: false,
      message: "user not found",
    });
    return;
  }

  if (req.body.hasOwnProperty("action")) {
    if (!checkObjectIdInArray(user._id, oldTransaction["users"])) {
      res.status(400).json({
        ok: false,
        message: "current user can not approve or reject the transacton",
      });
      return;
    }

    if (
      checkObjectIdInArray(user._id, oldTransaction["approvals"]) ||
      checkObjectIdInArray(user._id, oldTransaction["rejections"])
    ) {
      res.status(400).json({
        ok: false,
        message: "current user already approved or rejected the transacton",
      });
      return;
    }

    switch (req.body.action) {
      case "approve":
        await Transaction.findOneAndUpdate(
          { _id: transactionId },
          { $push: { approvals: user._id } },
          { runValidators: true }
        );
        break;
      case "reject":
        await Transaction.findOneAndUpdate(
          { _id: transactionId },
          { $push: { rejections: user._id } },
          { runValidators: true }
        );
        break;
    }

    res.status(200).json({
      ok: true,
      message: "transaction updated",
    });
    return;
  }

  if (!user._id.equals(oldTransaction.creator)) {
    res.status(400).json({
      ok: false,
      message: "transaction can be updated only by creator",
    });
    return;
  }

  await Transaction.updateOne(
    { _id: transactionId },
    { ...req.body },
    { runValidators: true }
  );

  res.status(200).json({
    ok: true,
    message: "transaction updated",
  });
}

export default async function handler(req, res) {
  try {
    await connect();

    switch (req.method) {
      case "GET":
        await handleRetrieveTransaction(req, res);
        break;
      case "DELETE":
        await handleDeleteTransaction(req, res);
        break;
      case "PUT":
        await handleUpdateTransaction(req, res);
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
      console.error(error);
      res.status(500).json({
        ok: false,
        message: "Internal server error",
        error,
      });
    }
  }
}
