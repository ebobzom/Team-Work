import pg from 'pg';

const con = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test2',
  password: 'woody4real',
  port: 5432,
});
con.query('DROP table if exists Users')
  .then(() => console.log('ok')) /* eslint no-console: off */
  .catch((e) => console.log(e)); /* eslint no-console: off */
con.query(`CREATE TABLE Users(
user_id serial primary key not null,
firstName varchar(15) not null,
lastName varchar(15) not null,
email varchar(25) not null,
password varchar not null,
gender varchar(12) not null,
jobRole varchar(12) not null,
department varchar(18) not null,
address varchar(30) not null,
isAdmin boolean not null,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`)
  .then(() => console.log('ok, working fine')) /* eslint no-console: off */
  .catch((e) => console.log(e)); /* eslint no-console: off */
