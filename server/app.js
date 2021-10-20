import express from 'express';
import mongoose from 'mongoose';
import config from './config';


const app = express();
const {MONGO_URI} = config;


mongoose.connect(MONGO_URI,{
        useNeWUrlParser : true,
        useUnifiedTopology: true,
})

.then(() => console.log("몽고 디비 연결 성공!"))
.catch((e) => console.log(e));

app.get('/')

export default app;