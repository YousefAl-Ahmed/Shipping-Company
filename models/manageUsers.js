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

module.exports = {getAllUsers,addUser};

    

