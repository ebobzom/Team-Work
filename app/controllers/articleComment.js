/* eslint linebreak-style: off */
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
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


const articlesComments = (req, res) => {
  const token = req.get('token');
  const tokenForTest = req.headers.token;
  const { articleNum } = req.params;
  const { comment } = req.body;
  const tokenFromCookie = req.cookies.token;

  jwt.verify(token || tokenForTest || tokenFromCookie, process.env.PASSWORD, (err, ans) => {
    if (err) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }

    if (ans) {
      const text = 'INSERT INTO article_comments(comment, articlefk) VALUES($1, $2);';
      const text1 = 'SELECT a.title, a.article, a.createdon, c.comment, c.createddate, c.articlefk ';
      const text2 = 'FROM articles a, article_comments c WHERE articleid = $1 AND articlefk = $2;';
      pool.query(text, [comment, articleNum])
        .then(() => {
          pool.query(text1 + text2, [articleNum, articleNum])
            .then((val) => {
              const fianalResult = {
                message: 'Comment successfully created',
                article: val.rows[val.rows.length - 1].title,
                articleTitle: val.rows[val.rows.length - 1].title,
                createdOn: val.rows[val.rows.length - 1].createdon,
                comment: val.rows[val.rows.length - 1].comment,
                commentDate: val.rows[val.rows.length - 1].createddate,
                articleId: val.rows[val.rows.length - 1].articlefk,
              };
              res.status(200).json({
                status: 'success',
                data: fianalResult,
              });
            })
            .catch(() => res.status(422).json({ status: 'error', error: 'error getting value' }));
        })
        .catch(() => res.status(422).json({ status: 'error', error: 'check your internet connectivity or you are not the article owner' }));
    }
    return null;
  });
  return null;
};

export default articlesComments;
