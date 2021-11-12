import express from 'express';
import auth from '../../middleware/auth';

import Post from '../../models/post';
import User from '../../models/user';
import Category from '../../models/category';
import Comment from '../../models/comments';

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
      res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    } catch (e) {
      console.error(e);
      res.json({ uploaded: false, url: null });
    }
  });

//게시글 불러오기
router.get("/skip/:skip", async (req, res) => {//GET /api/post
  try {
    const postCount = await Post.countDocuments();
    const postFindResult = await Post.find()
      .skip(Number(req.params.skip))
      .limit(6)
      .sort({ date: -1 });

    const categoryFindResult = await Category.find();
    const result = { postFindResult, categoryFindResult, postCount };

  
    res.json(result);

  }catch(e){
    console.error(e);
    res.json({ msg : "더 이상 게시글이 없습니다. "});
  }
});

//게시글 작성
router.post("/", auth, uploadS3.none(), async (req, res, next) => {
  try {
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });

    const findResult = await Category.findOne({
      categoryName: category,
    });

 

    if (isNullOrUndefined(findResult)) {
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    } else {
      await Category.findByIdAndUpdate(findResult._id, {
        $push: { posts: newPost._id },
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: findResult._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`);
  } catch (e) {
    console.log(e);
  }
});

//게시글 수정
//POST api/post
router.get("/:id/edit", auth, async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id).populate("creator", "name");
      res.json(post);
    } catch (e) {
      console.error(e);
    }
  });
  
  router.post("/:id/edit", auth, async (req, res, next) => {
 
    const {
      body: { title, contents, fileUrl, id },
    } = req;
  
    try {
      const modified_post = await Post.findByIdAndUpdate(
        id,
        {
          title,
          contents,
          fileUrl,
          date: moment().format("YYYY-MM-DD hh:mm:ss"),
        },
        { new: true }
      );
  
      res.redirect(`/api/post/${modified_post.id}`);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

//게시글 업로드
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "name")
      .populate({ path: "category", select: "categoryName" });
    post.views += 1;
    post.save();
 
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


//게시글 수정
router.get("/:id/edit", auth, async(req, res, next) => {//GET api/post/:id/post
  try{
    const post = await Post.findById(req.params.id).populate("creator", "name");
    res.json(post);
  }catch(e){
    console.error(e);
  }
});

router.post("/:id/edit", auth, async(req, res, next) => {

  const {body : {title, contents, fileUrl, id}} = req

  try{
    const modified_post = await Post.findByIdAndUpdate(
      id, {
        title, contens, fileUrl, date : moment().format("YYYY-MM-DD hh:mm:ss")
      },
      { new : true}
    )

    res.redirect(`/api/post/${modified_post.id}`);
  }catch(e){
    console.error(e);
    next(e);
  }
});



//게시글 삭제
router.delete('/:id', auth, async (req, res) => {//Delete api/post/:id
  await Post.deleteMany({ _id: req.params.id });
  await Comment.deleteMany({ post: req.params.id });
  await User.findByIdAndUpdate(req.user.id, {
    $pull: {
      posts: req.params.id,
      comments: { post_id: req.params.id },
    },
  });

  const CategoryUpdateResult = await Category.findOneAndUpdate(
    { posts: req.params.id },
    { $pull: { posts: req.params.id } },
    { new: true },
  );

  if (CategoryUpdateResult.posts.length === 0) {
    await Category.deleteMany({ _id: CategoryUpdateResult });
  }

  return res.json({ success: true });
});

//댓글//
//댓글 불러오기
//api/post/comments
router.get('/:id/comments', async(req, res) => {
  try{
    const comment = await Post.findById(req.params.id).populate({
      path : "comments",
    });
    const result = comment.comments;
  
    res.json(result);
  }catch(e){
    console.error(e);
  }
});

//댓글 추가
router.post("/:id/comments", async (req, res, next) => {

  const newComment = await Comment.create({
    contents: req.body.contents,
    creator: req.body.userId,
    creatorName: req.body.userName,
    post: req.body.id,
    date: moment().format("YYYY-MM-DD hh:mm:ss"),
  });


  try {
    await Post.findByIdAndUpdate(req.body.id, {
      $push: {
        comments: newComment._id,
      },
    });
    await User.findByIdAndUpdate(req.body.userId, { //누가 쓴 댓글인지 추가
      $push: {
        comments: {
          post_id: req.body.id,
          comment_id: newComment._id,
        },
      },
    });
    res.json(newComment);
  } catch (e) {
    console.log(e);
    next(e);
  }
});


//카테고리 찾기
router.get("/category/:categoryName", async (req, res, next) => {
  try {
    const result = await Category.findOne(
      {
        categoryName: {
          $regex: req.params.categoryName,
          $options: "i",
        },
      },
      "posts"
    ).populate({ path: "posts" });
   
    res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});



export default router;