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

//drop users table
sql = `DROP TABLE users`;
db.run(sql);



sql = `CREATE TABLE IF NOT EXISTS users(
	user_id	 INTEGER	   PRIMARY KEY AUTOINCREMENT,
  	email     TEXT  NOT NULL    UNIQUE,
    username TEXT  NOT NULL    UNIQUE,
    password  TEXT   NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    isAdmin      TEXT NOT NULL
)`;

db.run(sql);
//create table packages with primary key package_id, 
// package_name, weight, destination, status, 
// final_delivery_date,dimensions,insurance_ammount,catagoery
//drop packages table
// sql = `DROP TABLE packages`;
// db.run(sql);


// //drop packages table
//    sql = `DROP TABLE packages`;
//   db.run(sql);

sql = `CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    package_name TEXT NOT NULL,
    weight INTEGER NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL,
    final_delivery_date TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    insurance_amount INTEGER NOT NULL,
    catagory TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
    )`;
db.run(sql);







//remove unique from username

//insert into packages table
// sql = `INSERT INTO packages (username,package_name,weight,destination,status,final_delivery_date,dimensions,insurance_amount,catagory) VALUES ('jawadaljarrash','laptop',5,'cairo','in transit','2020-12-12','10x10x10',100,'electronics')`;
// db.run(sql);

// sql = `DROP TABLE locations`;
// db.run(sql);

//create table locations with primary key location_id,foreign key package_id,
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

//drop retail_center table
// sql = `DROP TABLE retail_center`;
// db.run(sql);


sql = `CREATE TABLE IF NOT EXISTS retail_center (
    retail_center_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    retail_center_name TEXT NOT NULL,
    retail_center_address TEXT NOT NULL,
    location_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (status) REFERENCES packages(status)
    FOREIGN KEY (receiver_name) REFERENCES users(username),
    FOREIGN KEY (sender_name) REFERENCES users(username),
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
    )`;
db.run(sql);
//insert into packages

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

