import express from 'express';
import auth from '../../middleware/auth';

import Post from '../../models/post';
require("@babel/polyfill");



const router = express.Router()

import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


const s3 = new AWS.S3({
    accessKeyId : process.env.AWS_KEY,
    secretAccessKey : process.env.AWS_PRIVATE_KEY
})


const uploadS3 = multer({
    storage : multerS3({
        s3,
        bucket : "blogreact/upload",
        region : "ap-northeast-2",
        key(req, file, ch) {
            const ext = path.extname(file.originalname);//확장자
            const basename = path.basename(file.originalname, ext);
            cb(null, basename + new Date().valueOf() + ext);
        }
    }),
    limits : { fileSize : 100 * 1024 * 1024 },
});


//이미지 업로드
router.post("/image", uploadS3.array("upload", 5), async(req, res, next) => {//api/post/image
    try{
        console.log(req.files.map(v) => v.location);
        res.json({ uploaded : true, url : req.files.map((v) => v.location)});
    }catch(e){
        console.error(e);
        res.json({uploaded : false, url : null});
    }
});




router.get("/", async (req, res) => {// api/post
    const postFindResult = await Post.find()
    console.log(postFindResult, "All Post Get");
    res.json(postFindResult)

});

//게시글 작성
router.post("/", auth, async (req, res, next) => {
    try{
        console.log(req, "req");
        const { title, contents, fileUrl, creator } = req.body;
        const newPost = await Post.create({
            title,
            contents,
            fileUrl,
            creator,
        });
        res.json(newPost);
    }catch(e){
        console.log(e);
    }
});

export default router;