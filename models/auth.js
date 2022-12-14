const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')



const getDbConnection = async () => {
    return await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    })
}


//this method will be called for the useres who wants to register,
// after ensuring that the email is unique
const addUser = async (email, username, password, isAdmin) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO users
    ('email', 'username', 'password', 'isAdmin')
    VALUES ('${email}', '${username}', '${password}' , 'false')`;

    await db.run(sql);
    await db.close();
    return 1; //1 means that the user has registered successfully
}


//this query will check if the user has an account (call this method after the user clicks on "log in")
//compare hashed passwords
const authUser = async (email, username) => {
    const db = await getDbConnection();
    const sql = `SELECT email, username FROM users WHERE (email = '${email}') OR (username = '${username}')`;
    const user = await db.get(sql);
    await db.close();
    return user;  //if the returned value (user) is empty, then there is no account with this information and the user cannot log in
}
//get all packages of a username
const getUserPackages = async (username) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE username = '${username}'`;
    const packages = await db.all(sql);
    await db.close();
    return packages;
}

//List the total number of package types



//get lost packages
const getLostPackages = async () => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE status = 'lost'`;
    const lostPackages = await db.all
    (sql);
    await db.close();
    return lostPackages;
}

const getDelayedPackages = async () => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE status = 'delayed'`;
    const lostPackages = await db.all
    (sql);
    await db.close();
    return lostPackages;
}

const getDeliveredPackages = async () => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE status = 'delivered'`;
    const lostPackages = await db.all
    (sql);
    await db.close();
    return lostPackages;
}
// get all packages
const getAllPackages = async () => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages`;
    const Allpackages = await db.all(sql);
    await db.close();
    return Allpackages;
}
//get user by username
const getUserInfo = async (email) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    const userInfo = await db.get(sql);
    await db.close();
    return userInfo;
}
const getUsername = async (email) => {
    const db = await getDbConnection();
    const sql = `SELECT username FROM users WHERE email = '${email}'`;
    const userInfo = await db.get(sql);
    await db.close();
    return userInfo;

}
const authLogIn = async (email, password) => {
    const db = await getDbConnection();
    const sql = `SELECT email, password FROM users WHERE email = '${email}'`;
    const user = await db.get(sql);
    await db.close();
    return user;  //if the returned value (user) is empty, then there is no account with this information and the user cannot log in
}


// do it later
const changeUserName = async (email, username, password) => {
    const db = await getDbConnection();
    await db.close();
}

// do it later
const changePassword = async (email, username, password) => {
    const db = await getDbConnection();
    await db.close();
}


const getUserID = async (email) => {
    const db = await getDbConnection();
    const user_id = await db.get(`SELECT user_id FROM users WHERE email = '${email}'`);
    await db.close();
    return user_id;
}

const isAdmin = async (email) => {

    const db = await getDbConnection();
    const isAdmin = await db.get(`SELECT isAdmin FROM users WHERE email = '${email}'`);

    await db.close();
    return isAdmin.isAdmin;
}





module.exports = { addUser, authUser, changeUserName, changePassword,
     getUserID, authLogIn, isAdmin, getUserInfo, getUsername, getUserPackages,getAllPackages,getLostPackages,getDelayedPackages,getDeliveredPackages };




