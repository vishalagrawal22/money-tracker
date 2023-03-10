import { Schema, models, model } from "mongoose";

const FriendRequestSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FriendRequest =
  models.FriendRequest || model("FriendRequest", FriendRequestSchema);
export default FriendRequest;
