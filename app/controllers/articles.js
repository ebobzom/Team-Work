/* eslint linebreak-style: off */
import jwt from 'jsonwebtoken';
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


const articles = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array().map((val) => ({ msg: val.msg })).filter((val) => val.msg !== 'Invalid value') });
  }
  const token = req.get('token');
  const tokenForTest = req.headers.token;
  const { token: cookieToken } = req.cookies;
  // console.log('token from headers', token);
  // console.log('token from headers 1', tokenForTest);
  // console.log('token from headers', cookieToken);
  // console.log('req.cookie is ', req.cookies);
  // console.log('final token gotten', token || tokenForTest || cookieToken);

  const { title, article } = req.body;
  jwt.verify(token || tokenForTest || cookieToken, process.env.PASSWORD, (err, ans) => {
    if (err) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }
    if (ans) {
      const text = 'INSERT INTO articles(title, article, userfk) VALUES($1, $2, $3) RETURNING *';
      pool.query(text, [title, article, ans.user_id])
        .then((result) => {
          const { createdon: createdOn, articleid: articleId, userId } = result.rows[0];
          return res.status(201).json({
            status: 'success',
            data: {
              message: 'Article sucessfully posted',
              articleId,
              userId,
              createdOn,
              article,
              title,
            },
          });
        })
        .catch(() => {
          res.status(422).json({ status: 'error', error: 'check your internet connectivity' });
        });
    }
    return null;
  });
  return null;
};

export default articles;
