import express from 'express';
import bcrypt from 'bcryptjs';

import jwt from "jsonwebtoken";
import config from "../../config/index";
import auth from "../../middleware/auth";
const { JWT_SECRET } = config;


import User from '../../models/user';

const router = express.Router();

//@routes   GET api/user
//@desc     GET all user
//@access   public

router.get("/", async(req, res) => {
    try{
        const users = await User.find()
        if(!users) throw Error("사용자가 존재 하지 않습니다.");
        res.status(200).json(users);
    }catch(e){
        console.log(e);
        res.status(400).json({msg: e.message} );
    }
});

//@routes   POST api/user
//@desc     Register all user
//@access   public

//회원가입
router.post("/", (req, res) => {
    // console.lpg(req)
    const { name, email, password } = req.body

    
    if(!name || !email || !password) {
        return res.status(400).json({msg : "모두 다 입력해주세요"});
    }

    //이미 가입한 유저인 경우
    User.findOne({ email }).then((user) => {
        if(user) return res.status(400).json({ mag : "이미 가입된 유저가 존재합니다"});
        const newUser = new User({
            name, email, password
        });
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save().then((user) => {
                jwt.sign(
                  { id: user.id },
                  JWT_SECRET,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });
              }
            );
          });
        });
      });
    });
  });

//프로필
//POST api/user/:username/profile
router.post("/:userName/profile", auth, async (req, res) => {
  try {
    const { previousPassword, password, rePassword, userId } = req.body;
    console.log(req.body, "userName Profile");
    const result = await User.findById(userId, "password");

    bcrypt.compare(previousPassword, result.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({
          match_msg: "기존 비밀번호와 일치하지 않습니다",
        });
      } else {
        if (password === rePassword) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              result.password = hash;
              result.save();
            });
          });
          res
            .status(200)
            .json({ success_msg: "비밀번호 변경에 성공했습니다" });
        } else {
          res
            .status(400)
            .json({ fail_msg: "비밀번호가 일치하지 않습니다" });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

export default router;