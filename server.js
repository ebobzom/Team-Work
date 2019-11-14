import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import xss from 'xss-clean';
import dotEnv from 'dotenv';
import router from './app/routes';

dotEnv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // limiting eachs IP will be allowed 100 request in every 15 minites
  max: 100,
});

const options = {
  expires: new Date(Date.now + process.env.COOKIE_EXPIRY_DATE),
  httpOnly: true,
};

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.cookiePassword, options));
app.use(limiter); // limit usage by an IP adress
app.use(cors()); // solves cross origin resource sharing
app.use(helmet()); // set proper headers for security reasons
app.use(hpp()); // prevent hpp parameter pollution
app.use(xss()); // prevents cross site scripting
app.use(router);

if (!module.parent) {
  app.listen(port, () => console.log(`app runing on port ${port}`)); /* eslint no-console: off */
}

export default app;
