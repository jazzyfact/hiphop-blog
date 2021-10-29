import mongoose from "mongoose";
import moment from "moment";
import dotenv from "dotenv";
dotenv.config();

const PostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      index: true,
    },
    contents: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: -2,//처음 작성 할 때 조회수 올라가는 거 방지
    },
    fileUrl: {
      type: String,
      // default: "https://source.unsplash.com/random/301x201",//임시
      default: process.env.REACT_APP_BASIC_IMAGE_URL
    },
    date: {
      type: String,
      default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  });

const Post = mongoose.model("post", PostSchema);

export default Post;