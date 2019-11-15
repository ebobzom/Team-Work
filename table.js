/* eslint linebreak-style: off */
import pg from 'pg';

const con = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'teamwork',
  password: 'woody4real',
  port: 5432,
});
con.connect();
con.query('DROP table if exists Users', (err) => {
  if (err) console.log(err); /* eslint no-console: off */
  console.log('ok, user table droped'); /* eslint no-console: off */
});

con.query('DROP table if exists articles', (err) => {
  if (err) console.log(err); /* eslint no-console: off */
  console.log('ok, article table droped'); /* eslint no-console: off */
});

const s1 = 'CREATE TABLE articles(articleId serial primary key not null, title varchar not null, article varchar not null,';
const s2 = ' createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, userfk serial references users(user_id))';

const t1 = 'CREATE TABLE Users(user_id serial primary key not null, firstName varchar(15) not null, lastName varchar(15) not null, email varchar(25) not null, password varchar not null,';
const t2 = 'gender varchar(12) not null, jobRole varchar(12) not null, department varchar(18) not null, address varchar(30) not null, isAdmin boolean not null, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)';
con.query(t1 + t2, (err) => {
  if (err) console.log(err); /* eslint no-console: off */
  console.log('ok: user table created'); /* eslint no-console: off */
});

con.query(s1 + s2, (err) => {
  if (err) console.log(err); /* eslint no-console: off */
  console.log('ok, article table created'); /* eslint no-console: off */
  con.end();
});
