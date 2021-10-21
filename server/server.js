import app from './app';
import config from './config/index';


const { PORT } = config

app.listen("7000", () => {
    console.log(`Server started on Post ${PORT}`);
});