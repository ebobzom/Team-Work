/* eslint linebreak-style: off */

import bcrypt from 'bcrypt';
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


const adminUserSignin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array().map((val) => ({ msg: val.msg })) });
  }

  const {
    email, password,
  } = req.body;

  // check if user exists
  pool.query(`SELECT user_id, email, password, created_at, department, jobRole from Users WHERE email='${email}'`)
    .then((ans) => {
      if (!ans.rows[0]) {
        return res.status(401).json({ status: 'error', error: 'please create an account or wrong email' });
      }

      const {
        created_at: createdAt, password: dbPassword, user_id: userId, department, jobRole,
      } = ans.rows[0];
      // check password validity
      bcrypt.compare(password, dbPassword, (err, result) => {
        if (err) {
          return res.status(401).json({ status: 'error', error: 'wrong email or password' });
        }

        if (result) {
          jwt.sign({
            createdAt, email, department, jobRole,
          }, process.env.PASSWORD, { expiresIn: '1d' }, (errorObj, token) => {
            if (errorObj) {
              return res.status(401).json({ status: 'error', error: 'token error' });
            }
            return res.status(200).json({
              status: 'success',
              data: {
                token,
                userId,
              },
            });
          });
        }
        return null;
      });
      return null;
    })
    .catch(() => res.status(422).json({ status: 'error', error: 'check your network connection 2' }));
  return null;
};

export default adminUserSignin;
