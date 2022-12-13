const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')



//connect to the DB
const db = new sqlite3.Database('./database/website.db', sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) return console.log(err.message);
        else console.log('connected to the SQLlite database');
    });
db.get("PRAGMA foreign_keys = ON")

let sql;


sql = `CREATE TABLE IF NOT EXISTS users(
	user_id	 INTEGER	   PRIMARY KEY AUTOINCREMENT,
  	email     TEXT  NOT NULL    UNIQUE,
    username TEXT  NOT NULL    UNIQUE,
    password  TEXT   NOT NULL,
    isAdmin      TEXT,
)`;

db.run(sql);