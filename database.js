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
// sql = `DROP TABLE users`;
// db.run(sql);



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

//drop payment table
// sql = `DROP TABLE payment`;
// db.run(sql);

sql = `CREATE TABLE IF NOT EXISTS payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    insurance_amount INTEGER NOT NULL,
    payment_status TEXT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(package_id),
    FOREIGN KEY (username) REFERENCES users(username)
    )`;

db.run(sql);
// sql = `DROP TABLE packages`;
// db.run(sql);
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
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
    )`;
db.run(sql);

//drop retail_center table
// sql = `DROP TABLE retail_centers_table`;
// db.run(sql);

// create retail_centers_table with primary key retail_center_id, center_name, center_address, location_name
sql = `CREATE TABLE IF NOT EXISTS retail_centers_table (
    retail_center_id INTEGER PRIMARY KEY,
    center_name TEXT NOT NULL,
    center_address TEXT NOT NULL,
    location_name TEXT NOT NULL
    )`;
db.run(sql);
// insert centers into retail_centers_table
// let center1 = [1, 'The Fast Tracking Center', 'Eastren Provience, Dammam, 32210', 'Dammam'];
// let center2 = [2, 'Kingdom Center', 'King Fahd Rd, Al Olaya, Riyadh 12214', 'Riyadh'];
// let center3 = [3, 'City Center', 'Mishrifah, Jeddah 23332', 'Jeddah'];
// let center4 = [4, 'Al Khobar Center', 'Al Khobar 31952', 'Al Khobar'];
// let center5 = [5, 'Jazan Center', 'Jazan Port 31952', 'jazan'];

// let centers = [center1, center2, center3, center4, center5];

// for (let i = 0; i < centers.length; i++) {
//     db.run(`INSERT INTO retail_centers_table VALUES (?,?,?,?)`, centers[i], (err) => {
//         if (err) return console.log(err.message);
//         else console.log('inserted into retail_centers_table');
//     });
// }
// drop retail_center table
// sql = `DROP TABLE retail_center`;
// db.run(sql);
// drop packages table

sql = `CREATE TABLE IF NOT EXISTS retail_center (
    retail_center_id INTEGER,
    package_id INTEGER NOT NULL,
    retail_center_name TEXT NOT NULL,
    retail_center_address TEXT NOT NULL,
    location_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (status) REFERENCES packages(status),
    FOREIGN KEY (retail_center_id) REFERENCES retail_centers_table(retail_center_id),
    FOREIGN KEY (retail_center_name) REFERENCES retail_centers_table(center_name),
    FOREIGN KEY (retail_center_address) REFERENCES retail_centers_table(center_address),
    FOREIGN KEY (location_name) REFERENCES retail_centers_table(location_name),
    FOREIGN KEY (status) REFERENCES packages(status)
    FOREIGN KEY (receiver_name) REFERENCES users(username),
    FOREIGN KEY (sender_name) REFERENCES users(username),
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
    )`;
db.run(sql);
//insert into packages
// drop all database


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

