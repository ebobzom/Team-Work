/* eslint linebreak-style: off */
import express from 'express';
import { check } from 'express-validator';

import adminCreateUser from './controllers/adminCreateUser';
import adminUserSignin from './controllers/adminUserSignin';
import articles from './controllers/articles';
import editArticles from './controllers/editArticle';
import deleteArticles from './controllers/deleteArticle';
import articlesComment from './controllers/articleComment';
import postGifs from './controllers/postGifs';


const router = express.Router();

router.post('/api/v1/auth/create-user', [
  check('firstName').exists().isString().withMessage('first name is required and should be alphabets'),
  check('firstName').isLength({ max: 15 }).withMessage('first name should have maximum of 15 characters'),
  check('lastName').exists().isString().withMessage('last name is required and should be alphabets'),
  check('lastName').isLength({ max: 15 }).withMessage('last name must not exceed 15 characters'),
  check('email').exists().isEmail().withMessage('email is required with the right format'),
  check('email').isLength({ max: 25 }).withMessage('email must not exceed 25 characters'),
  check('password').exists().matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/).withMessage('password should be aplhanumeric with a special character and be at list 6 charcters'),
  check('password').isLength({ min: 6, max: 12 }).withMessage('password not be less than 6 characters or more than 12'),
  check('gender').isString().withMessage('gender must be only alphabets'),
  check('gender').isLength({ max: 12 }).withMessage('gender must not exceed 12 characters'),
  check('jobRole').isString().withMessage('job role must be only alphabets'),
  check('jobRole').isLength({ max: 15 }).withMessage('job role must not exceed 12 characters'),
  check('department').isString().withMessage('department must be only alphabets'),
  check('department').isLength({ max: 18 }).withMessage('department must not exceed 12 characters'),
  check('address').isString().withMessage('address must be only alphabets'),
  check('address').isLength({ max: 30 }).withMessage('address must not exceed 30 characters'),
  check('isAdmin').isBoolean().withMessage('a bolean is required'),
], adminCreateUser);

router.post('/api/v1/auth/signin', [
  check('email').exists().isString().withMessage('email is required'),
  check('password').exists().matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/).withMessage('password must not be less than 6 characters or more than 12 and should contain at least on special charater'),
], adminUserSignin);

router.post('/api/v1/auth/articles', [
  check('title').exists().isString().withMessage('title is required and must be string'),
  check('title').exists().isLength({ max: 25 }).withMessage('title shpuld not be more than 25 characters'),
  check('article').exists().isString().withMessage('articles should be a string'),
], articles);

router.patch('/api/v1/auth/articles/:articleNum', [
  check('title').exists().isString().withMessage('title is required and must be string'),
  check('title').exists().isLength({ max: 25 }).withMessage('title should not be more than 25 characters'),
  check('article').exists().isString().withMessage('articles should be a string'),
], editArticles);

router.delete('/api/v1/auth/articles/:articleNum', deleteArticles);
router.post('/api/v1/auth/articles/:articleNum/comment', articlesComment);
router.post('/api/v1/auth/gifs', [
  check('title').exists().isLength({ max: 25 }).withMessage('title should not be more than 25 characters'),
], postGifs);
export default router;
