import pg from 'pg';

const con = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'TeamWorkUsers',
  password: 'woody4real',
  port: 5432,
});
con.connect();
con.query('DROP table if exists Users', (err, res) => {
  if (err) console.log(err);
  console.log('ok');
});

const t1 = 'CREATE TABLE Users(user_id serial primary key not null, firstName varchar(15) not null, lastName varchar(15) not null, email varchar(25) not null, password varchar not null,';
const t2 = 'gender varchar(12) not null, jobRole varchar(12) not null, department varchar(18) not null, address varchar(30) not null, isAdmin boolean not null, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)';
con.query(t1 + t2, (err, res) => {
  if (err) console.log(err);
  console.log('ok');
  con.end();
});
