import express from 'express';
import auth from '../../middleware/auth';

import Post from '../../models/post';
import User from '../../models/user';
import Category from '../../models/category';

require("@babel/polyfill");



const router = express.Router();

import multer from "multer";
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import moment from 'moment';
import { isNullOrUndefined } from 'util';

dotenv.config();


const s3 = new AWS.S3({
    accessKeyId : process.env.AWS_KEY,
    secretAccessKey : process.env.AWS_PRIVATE_KEY
})


const uploadS3 = multer({
    storage: multerS3({
      s3,
      bucket: "blogreact/upload",
      region: "ap-northeast-2",
      key(req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + new Date().valueOf() + ext);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
  });

//이미지 업로드
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => {
    try {
      console.log(req.files.map((v) => v.location));
      res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    } catch (e) {
      console.error(e);
      res.json({ uploaded: false, url: null });
    }
  });


router.get("/", async (req, res) => {// api/post
    const postFindResult = await Post.find()
    console.log(postFindResult, "All Post Get");
    res.json(postFindResult)

});


//게시글 작성
router.post("/", auth, uploadS3.none(), async (req, res, next) => { //POST api/post
    try{
        console.log(req, "req");
        const { title, contents, fileUrl, creator, category } = req.body;
        const newPost = await Post.create({
            title,
            contents,
            fileUrl,
            creator,
            date : moment().format("YYYY-MM-DD hh:mm:ss")
        });

        const fineResult = await Category.findOne({
          categoryName : category
        });

        console.log(fineResult, "Find Result");

        if(isNullOrUndefined(findResult)){
          const newCategory = await Category.create({
            categoryName : Category
          });
          await Post.findByIdAndUpdate(newPost._id, {
            $push : { Category : newCategory._id }
          });
          await Category.findByIdAndUpdate(newCategory._id, {
            $push : { posts: newPost._id }
          });
          await User.findByIdAndUpdate(req.user.id, {
            $psuh : { posts : newPost._id }
          });
        } else {
          await Category.findByIdAndUpdate(findResult._id, {
            $push : {posts : newPost._id}
          });
          await Post.findByIdAndUpdate(newPost._id, {
            category : findResult._id
          });
        }
        return res.redirect(`api/post/${newPost._id}`);
    }catch(e){
        console.log(e);
    }
});

//게시글 업로드
//POST api/post/:id
router.get("/:id", async(req, res, next) => {
  try{
    const post = await Post.findById(req.params.id)
    .populate("creator", "name")
    .populate({ path: "category", select: "categoryName" });
    post.views += 1;
    post.save();
    console.log(post);
    res.json(post);
  }catch(e){
    console.error(e);
    next(e);
  }
});

export default router;