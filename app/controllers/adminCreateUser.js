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


const adminCreateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array().map((val) => ({ msg: val.msg })) });
  }

  const {
    firstName, lastName, email, password,
    gender, jobRole, department, address, isAdmin,
  } = req.body;
  const text = 'INSERT INTO Users(firstName, lastName, email, password, gender, jobRole,department, address, isAdmin) VALUES';
  const inputs = '($1, $2,$3, $4,$5, $6, $7, $8, $9) RETURNING *';

  // check if user exists
  pool.query(`SELECT user_id, email from Users WHERE email='${email}'`)
    .then((ans) => {
      if (ans.rows[0]) {
        return res.status(401).json({ status: 'error', error: 'user all ready exists' });
      }
      // hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(401).json({ status: 'error', error: 'hash error' });
        }
        // insert new user into DB
        pool.query(text + inputs, [
          firstName, lastName, email, hash, gender, jobRole, department, address, isAdmin,
        ])
          .then((result) => {
          // generate token
            jwt.sign({ user_id: result.rows[0].user_id }, process.env.PASSWORD, { expiresIn: '1d' }, (errorObj, token) => {
              if (errorObj) {
                return res.status(401).json({ status: 'error', error: 'token error' });
              }
              // add token and message to result
              const { user_id: userId, created_at: createdAt } = result.rows[0];
              return res.status(201).json({
                status: 'success',
                data: {
                  message: 'User account succesfully created',
                  token,
                  userId,
                  email,
                  department,
                  gender,
                  jobRole,
                  createdAt,

                },
              });
            });
          })
          .catch((errorMsg) => {
            console.log(errorMsg); /* eslint no-console: off */
            res.status(422).json({ status: 'error', error: 'check your network connection 1' });
          });
        return null;
      });
      return null;
    })
    .catch(() => res.status(422).json({ status: 'error', error: 'check your network connection 2' }));
  return null;
};

export default adminCreateUser;
