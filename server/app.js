import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
require("@babel/polyfill");

import postRoutes from './routes/api/post';
import userRoutes from './routes/api/user';
import authRoutes from './routes/api/auth';
import searchRoutes from "./routes/api/search";

const app = express();
const {MONGO_URI} = config;


app.get(hpp());
app.use(helmet());//서버 보안 해주는 라이브러리

app.use(cors({origin : true, credentials : true}));
app.use(morgan("dev"));

app.use(express.json());



mongoose.connect(MONGO_URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log("몽고 디비 연결 성공!"))
.catch((e) => console.log(e));


//라우터

app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);


export default app;