const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')



const getDbConnection = async () => {
    return await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    })
}

//show all users
const getAllUsers = async () => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM users WHERE isAdmin = 'false'`;
    const users = await
        db.all
            (sql);
    await db.close();
    return users;
}
//add user
const addUser = async (email, username, password, isAdmin, firstName, lastName) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO users
    ('email', 'username', 'password', 'isAdmin','firstName','lastName')
    VALUES ('${email}', '${username}', '${password}' , '${isAdmin}', '${firstName}', '${lastName}')`;

    await db
        .run(sql);
    await db.close();
}

//delete user
const removeUser = async (user_id) => {
    const db = await getDbConnection();
    const sql = `DELETE FROM users WHERE user_id = '${user_id}'`;
    await db
        .run(sql);
    await db.close();
}

//update user
const editUser = async (user_id, email, username, isAdmin, firstName, lastName) => {
    const db = await getDbConnection();
    const sql = `UPDATE users SET email = '${email}', username = '${username}', isAdmin = '${isAdmin}', firstName = '${firstName}', lastName = '${lastName}' WHERE user_id = '${user_id}'`;
    await db
        .run(sql);
    await db.close();
}

//get user info
const getUserInfo = async (user_id) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM users WHERE user_id = '${user_id}'`;
    const userInfo = await db.get(sql);
    await db.close();
    return userInfo;
}

//get all emails
const getAllEmails = async () => {
    const db = await getDbConnection();
    const sql = `SELECT email FROM users`;
    const emails
        = await
            db.all
                (sql);
    await db.close();
    return emails;
}


module.exports = { getAllUsers, addUser, removeUser, editUser, getUserInfo, getAllEmails };



