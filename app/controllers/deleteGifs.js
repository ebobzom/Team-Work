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


const deleteGifs = (req, res) => {
  const token = req.get('token');
  const tokenForTest = req.headers.token;
  const { gifId } = req.params;
  const tokenFromCookie = req.cookies.token;

  jwt.verify(token || tokenForTest || tokenFromCookie, process.env.PASSWORD, (err, ans) => {
    if (err) {
      return res.status(422).json({ status: 'error', error: 'please login' });
    }

    if (ans) {
      const text1 = `BEGIN TRANSACTION; DELETE from gif_comments where giffk = '${gifId}';`;
      const text2 = `DELETE FROM gifs WHERE gifid='${gifId}' AND usersfk='${ans.user_id || ans.user_id === 1}'; COMMIT TRANSACTION;`;

      pool.query(text1 + text2)
        .then(() => res.status(200).json({
          status: 'success',
          data: {
            message: 'gif post successfully deleted',
          },
        }))
        .catch(() => res.status(422).json({ status: 'error', error: 'check your internet connectivity or you are not the article owner' }));
    }
    return null;
  });
  return null;
};

export default deleteGifs;
