import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    min: 0,
    default: 0,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = models.User || model("User", UserSchema);
