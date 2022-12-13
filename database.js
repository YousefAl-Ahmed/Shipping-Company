const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
console.log('database.js loaded')


//connect to the DB
const db = new sqlite3.Database('./website.db', sqlite3.OPEN_READWRITE,
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
    isAdmin      TEXT NOT NULL
)`;

db.run(sql);
//create table packages with primary key package_id, 
// package_name, weight, destination, status, 
// final_delivery_date,dimensions,insurance_ammount,catagoery
//drop packages table


sql = `CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL  UNIQUE,
    package_name TEXT NOT NULL,
    weight INTEGER NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL,
    final_delivery_date TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    insurance_ammount INTEGER NOT NULL,
    catagoery TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
    )`;
db.run(sql);

//create table locations with primary key location_id,foreign key package_id,
//location_name,location_date,type
sql = `CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    location_name TEXT NOT NULL,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
    )`;
db.run(sql);

//create table retail center with primary key retail_center_id,
//retail_center_name,retail_center_address
sql = `CREATE TABLE IF NOT EXISTS retail_center (
    retail_center_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    retail_center_name TEXT NOT NULL,
    retail_center_address TEXT NOT NULL,
    location_name TEXT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
    )`;
db.run(sql);

db.run(sql
    , (err) => {
        if (err) return console.log(err.message);
        else console.log('table packages created');
    });
db.serialize(function () {
    db.all("select name from sqlite_master where type='table'", function (err, tables) {
        console.log(tables);
    });
});

