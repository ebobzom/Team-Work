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


const commentOnArticle = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array().map((val) => ({ msg: val.msg })).filter((val) => val.msg !== 'Invalid value') });
  }
  const token = req.get('token');
  const tokenForTest = req.headers.token;
  const { articleNum } = req.params;
  const tokenFromCookie = req.cookies.token;

  const { title, article } = req.body;
  jwt.verify(token || tokenForTest || tokenFromCookie, process.env.PASSWORD, (err, ans) => {
    if (err) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }

    if (ans) {
      const text = `UPDATE articles SET title='${title}', article = '${article}' WHERE articleid='${articleNum}' AND userfk='${ans.user_id || 1}' RETURNING *`;
      pool.query(text)
        .then((result) => {
          const { createdon: createdOn, articleid: articleId, userfk: userId } = result.rows[0];
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Article successfully updated',
              articleId,
              userId,
              createdOn,
              article,
              title,
            },
          });
        })
        .catch(() => res.status(422).json({ status: 'error', error: 'check your internet connectivity' }));
    }
    return null;
  });
  return null;
};

export default commentOnArticle;
