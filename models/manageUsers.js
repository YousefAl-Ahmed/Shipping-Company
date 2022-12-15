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
    const sql = `SELECT * FROM users`;
    const users = await
        db.all
            (sql);
    await db.close();
    return users;
}
//add user
const addUser = async (email, username, password, isAdmin) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO users
    ('email', 'username', 'password', 'isAdmin')
    VALUES ('${email}', '${username}', '${password}' , '${isAdmin}')`;

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
const editUser = async (user_id, email, username, password, isAdmin) => {
    const db = await getDbConnection();
    const sql = `UPDATE users SET email = '${email}', username = '${username}', password = '${password}', isAdmin = '${isAdmin}' WHERE user_id = '${user_id}'`;
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


module.exports = { getAllUsers, addUser, removeUser, editUser, getUserInfo };



