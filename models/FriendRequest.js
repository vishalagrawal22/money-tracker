import { Schema, models, model } from "mongoose";

const FriendRequestSchema = new Schema({
  receiverID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports =
  models.FriendRequest || model("FriendRequest", FriendRequestSchema);
