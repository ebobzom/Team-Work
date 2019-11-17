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


const deleteArticles = (req, res) => {
  const token = req.get('token');
  const tokenForTest = req.headers.token;
  const { articleNum } = req.params;

  jwt.verify(token || tokenForTest, process.env.PASSWORD, (err, ans) => {
    if (err) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }

    if (ans) {
      const text = `DELETE FROM articles WHERE articleid='${articleNum}' `;
      pool.query(text)
        .then(() => res.status(200).json({
          status: 'success',
          data: {
            message: 'Article successfully deleted',
          },
        }))
        .catch(() => res.status(422).json({ status: 'error', error: 'check your internet connectivity' }));
    }
    return null;
  });
  return null;
};

export default deleteArticles;
