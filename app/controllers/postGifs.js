/* eslint linebreak-style: off */
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import { config } from 'dotenv';
import { validationResult } from 'express-validator';
import { Pool } from 'pg';

// setup enviroment variable
config();
let pgSetUp;

if (process.env.HEROKU_URL) {
  pgSetUp = { connectionString: process.env.HEROKU_URL };
} else {
  pgSetUp = {
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(pgSetUp);


const postGifs = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array().map((val) => ({ msg: val.msg })).filter((val) => val.msg !== 'Invalid value') });
  }

  const cloudinaryV2 = cloudinary.v2;

  cloudinaryV2.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinaryApiKey,
    api_secret: process.env.cloudinaryApiSecret,
  });

  const { title: finalTitle } = req.body;
  const { image } = req.files;
  const cookieToken = req.cookies.token;
  const token = req.get('token');
  const tokenForTest = req.headers.token;

  jwt.verify(token || tokenForTest || cookieToken, process.env.PASSWORD, (error, ans) => {
    if (error) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }
    if (ans) {
      cloudinaryV2.uploader.upload(image.tempFilePath, (err, answer) => {
        if (err) {
          return res.status(401).json({
            status: 'error',
            error: 'Please check your internet connection',
          });
        }
        const text = 'INSERT INTO gifs(title, imageUrl, usersfk) VALUES($1, $2, $3) RETURNING *';
        pool.query(text, [finalTitle, answer.url, ans.user_id])
          .then((result) => {
            const {
              createdon: createdOn, imageurl: imageUrl, gifid: gifId, title,
            } = result.rows[0];
            return res.status(201).json({
              status: 'success',
              data: {
                message: 'GIF image successfully posted',
                createdOn,
                imageUrl,
                gifId,
                title,
              },
            });
          })
          .catch(() => {
            res.status(422).json({ status: 'error', error: 'check your internet connectivity' });
          });
        return null;
      });
    }
    return null;
  });
  return null;
};

export default postGifs;
