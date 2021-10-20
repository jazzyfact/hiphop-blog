import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';


import postRoutes from './routes/api/post';
import userRoutes from './routes/api/user';


const app = express();
const {MONGO_URI} = config;


app.get(hpp());
app.use(helmet());//서버 보안 해주는 라이브러리

app.use(cors({origin : true, credentials : true}));
app.use(morgan("dev"));

app.use(express.json());



mongoose.connect(MONGO_URI,{
    // useNeWUrlParser : true,
    // useUnifiedTopology: true,
}).then(() => console.log("몽고 디비 연결 성공!"))
.catch((e) => console.log(e));


//라우터
app.get("/");
app.get('/api/post', postRoutes);
app.get('/api/user', userRoutes);


export default app;