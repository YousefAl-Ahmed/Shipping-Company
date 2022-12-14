const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')



const getDbConnection = async () => {
    return await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    })
}

//add package
const addPackage = async (username, package_name, weight, destination, status, final_delivery_date, dimensions, insurance_ammount, catagoery) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO packages 
    ('username', 'package_name', 'weight', 'destination', 'status', 'final_delivery_date', 'dimensions', 'insurance_ammount', 'catagoery')
    VALUES ('${username}', '${package_name}', '${weight}', '${destination}', '${status}', '${final_delivery_date}', '${dimensions}', '${insurance_ammount}', '${catagoery}')`;
    await db.run(sql);
    await db.close();
    return 1; 
}

//remove package
const removePackage = async (package_id) => {
    const db = await getDbConnection();
    const sql = `DELETE FROM packages WHERE package_id = '${package_id}'`;
    await db
    .run(sql);
    await db.close();
    return 1; 
}

//get package info
const getPackageInfo = async (package_id) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE package_id = '${package_id}'`;
    const packageInfo = await db.get(sql);
    await db.close();
    return packageInfo;
}
//update package info
const editPackage = async (package_id, package_name, weight, destination, status, final_delivery_date, dimensions, insurance_ammount, catagoery) => {
    const db = await getDbConnection();
    const sql = `UPDATE packages SET package_name = '${package_name}', weight = '${weight}', destination = '${destination}', status = '${status}', final_delivery_date = '${final_delivery_date}', dimensions = '${dimensions}', insurance_ammount = '${insurance_ammount}', catagoery = '${catagoery}' WHERE package_id = '${package_id}'`;
    await db
    .run(sql);
    await db.close();
}

    

module.exports = {addPackage,removePackage,getPackageInfo,editPackage};

