import { model, models, Schema } from "mongoose";

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
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "The users array must have at least one element",
    },
    required: true,
  },
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
    validate: {
      validator: function (v) {
        return this.users.includes(v);
      },
      message: "The payer must be included in the users array",
    },
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
