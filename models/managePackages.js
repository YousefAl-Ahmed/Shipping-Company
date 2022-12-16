const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')



const getDbConnection = async () => {
    return await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    })
}

//add package
const addPackage = async (username, package_name, weight, destination, status, final_delivery_date, dimensions, insurance_amount, catagory, reciever_name) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO packages 
    ('username', 'package_name', 'weight', 'destination', 'status', 'final_delivery_date', 'dimensions', 'insurance_amount', 'catagory','payment_status')
    VALUES ('${username}', '${package_name}', '${weight}', '${destination}', '${status}', '${final_delivery_date}', '${dimensions}', '${insurance_amount}', '${catagory}','not paid')`;
    //select last inserted package id

    await db.run(sql);
    await db.close();

    let package_id = getLastPackageId();
    package_id.then(function (result) {
        const package_id = result.package_id;
        addToRetailCenter(package_id, destination, username, reciever_name, username);


    });

    // package_id.then(function(result) {
    // return result;
    // console.log(result);
    // });

    //  addToRetailCenter(destination,username,receiver_name,username);


}
//get last inserted package id
const getLastPackageId = async () => {
    const db = await getDbConnection();
    const package_id = await db.get("SELECT package_id FROM packages ORDER BY package_id DESC LIMIT 1");
    await db.close();
    return package_id;
}




async function addToRetailCenter(package_id, destination, username, reciever_name, username) {


    const db = await getDbConnection();

    const sql = `INSERT INTO retail_center
    (package_id,'retail_center_name','retail_center_address','location_name','sender_name','receiver_name','status')
    VALUES ('${package_id}','${destination}','${destination}','${destination}','${username}','${reciever_name}','not paid')`;
    await db
        .run(sql);
    await db.close();
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
const editPackage = async (package_id, package_name, weight, destination, status, final_delivery_date, dimensions, insurance_amount, catagory) => {
    const db = await getDbConnection();
    const sql = `UPDATE packages SET package_name = '${package_name}', weight = '${weight}', destination = '${destination}', status = '${status}', final_delivery_date = '${final_delivery_date}', dimensions = '${dimensions}', insurance_amount = '${insurance_amount}', catagory = '${catagory}' WHERE package_id = '${package_id}'`;
    await db
        .run(sql);
    await db.close();
}

//add package to locations 
const addPackageRoute = async (package_id, location_name, date, locationType) => {
    const db = await getDbConnection();
    //split date
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    const sql = `INSERT INTO locations
    ('package_id', 'location_name', 'day','month','year','type')
    VALUES ('${package_id}', '${location_name}', '${day}','${month}','${year}','${locationType}')`;
    await db.run
        (sql);
    await db.close();
}

//get package between two dates
const getLostPackagesBetweenDates = async (startDate, endDate) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE final_delivery_date BETWEEN '${startDate}' AND '${endDate}' AND status = 'lost'`;
    const packages
        = await
            db.all
                (sql);
    await db.close();
    return packages;
}

const getDelayedPackagesBetweenDates = async (startDate, endDate) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE final_delivery_date BETWEEN '${startDate}' AND '${endDate}' AND status = 'delayed'`;
    const packages
        = await
            db.all
                (sql);
    await db.close();
    return packages;
}
const getDeliveredPackagesBetweenDates = async (startDate, endDate) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE final_delivery_date BETWEEN '${startDate}' AND '${endDate}' AND status = 'delivered'`;
    const packages
        = await
            db.all
                (sql);
    await db.close();
    return packages;
}

const catagory_count = async (startDate, endDate) => {
    const db = await getDbConnection();
    const sql = `SELECT catagory, COUNT(package_id) AS packages_count FROM packages WHERE final_delivery_date BETWEEN '${startDate}' AND '${endDate}'  GROUP BY catagory`;
    const packages
        = await
            db.all
                (sql);
    await db.close();
    return packages;
}
//get packages in retail center by username where username is the receiver
const getPackgesInRetailCenter = async (username) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM retail_center WHERE receiver_name = '${username}'`;
    const packages = await db.all
        (sql);
    await db.close();
    return packages;
}
const getSentPackgesInRetailCenter = async (username) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM retail_center WHERE sender_name = '${username}'`;
    const packages = await db.all
        (sql);
    await db.close();
    return packages;
}
const getPackageInfoByCatagory = async (username, catagory) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE username = '${username}' AND catagory = '${catagory}'`;
    const packages = await db.all
        (sql);
    await db.close();
    return packages;
}
const getPackageInfoByDate = async (username, date) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE username = '${username}' AND final_delivery_date = '${date}'`;
    const packages = await db.all
        (sql);
    await db.close();
    return packages;
}
const getPackageInfoByLocation = async (username, location) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages WHERE username = '${username}' AND destination = '${location}'`;
    const packages = await db.all
        (sql);
    await db.close();
    return packages;
}


const track_packages = async (catagory, location, status) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages JOIN locations WHERE packages.catagory = '${catagory}' AND locations.location_name = '${location}' AND packages.status = '${status}'`;
    const packages
        = await
            db.all
                (sql);
    await db.close();
    return packages;
}

const sent_packages_user = async (username) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM packages  WHERE username = (select sender_name from retail_center where sender_name = '${username}')`;
    const packages
        = await
        db.all
        (sql);
    await db.close();
    return packages;
}

        

// export all the functions
module.exports = {
    addPackage,
    removePackage,
    getPackageInfo,
    editPackage,
    addPackageRoute,
    getLostPackagesBetweenDates,
    getDelayedPackagesBetweenDates,
    getDeliveredPackagesBetweenDates,
    catagory_count,
    getPackgesInRetailCenter,
    getPackageInfoByCatagory,
    getPackageInfoByDate,
    getPackageInfoByLocation,
    track_packages,
    getSentPackgesInRetailCenter
  
}


