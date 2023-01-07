import { Schema } from "mongoose";

const TransactionSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  description: {
    type: String,
    optional: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  approvals: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  category: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  payer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  includePayerInSplit: {
    type: Boolean,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

TransactionSchema.virtual("split").get(function () {
  let numUsers = this.users.length;
  if (!this.includePayerInSplit) {
    numUsers--;
  }

  return this.price / numUsers;
});

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
export default Transaction;
