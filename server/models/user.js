import mongoose from 'mongoose';
import moment from 'moment';

//Create Schema
// Create Schema
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["esens", "beenzino", "User"],
      default: "User",
    },
    register_date: {
      type: Date,
      default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    comments: [
      {
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "post",//참조
        },
        comment_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment",
        },
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  });
  

const User = mongoose.model("user", UserSchema);

export default User;