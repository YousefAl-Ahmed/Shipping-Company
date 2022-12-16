
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs")

const path = require('path');

//models
const auth = require('./models/auth');
const managePackages = require('./models/managePackages');
const manageUsers = require('./models/manageUsers');
// const plans = require('./models/plans');
const { render } = require("ejs");


//express app
const app = express();
// app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

//view engine
app.set("view engine", "ejs");

//session
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

//middleware & static files
app.use(express.static('public'));

// app.use('/style', express.static('style'));

app.use(express.urlencoded({ extended: 'false' }));
app.use(express.json());




//routing 
// app.get("/", async (req, res) => {
//     res.render("index", {user: req.session.user});
// });

app.get("/", async (req, res) => {
    const email = req.body.email;

    res.render("index", { email: email, userInfo: await auth.getUserInfo(email), user: req.session.user });


});


//------------------register routes----------------------------
app.get("/register", async (req, res) => {
    res.render("register");
});

app.get("/login", async (req, res) => {

    res.render("login");
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/");
    });
});
//pass the user info to the navbar partial page

app.get("/user-page/:username", async (req, res) => {
    const username = req.params.username;
    const email = req.body.email;

    const packages = await auth.getUserPackages(username);
    res.render("user-page", { packages: packages, user: req.session.user, userInfo: await auth.getUserInfoByUsername(username) });
});
//app get user profile
app.get("/user-page/:username/profile", async (req, res) => {
    const username = req.params.username;
    res.render("profile", { user: req.session.user, userInfo: await auth.getUserInfoByUsername(username) });
});
app.get("/user-page/:username/receive-package", async (req, res) => {
    const username = req.params.username;
    res.render("receive-package", { user: req.session.user, userInfo: await auth.getUserInfoByUsername(username), packages: await auth.getUserPackages(username), receivedPackages: await managePackages.getPackgesInRetailCenter(username) });
});
app.post("/auth", async (req, res) => {


    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;


    let hashedPassword = await bcrypt.hash(password, 8);

    const info = await auth.authUser(email, username)
    if (info === undefined) {
        await auth.addUser(email, username, hashedPassword, false, firstName, lastName);

        res.redirect("/login");
    } else res.render("register", { message: "not unique" })
});

app.post("/user-page/:username/send-package", async (req, res) => {
    const username = req.params.username;
    const package_name = req.body.package_name;
    const weight = req.body.weight;
    const retail_center = req.body.retail_center;
    const status = req.body.status;
    const dimentions = req.body.dimentions;
    const insurance_amount = req.body.insurance_amount;
    const catagory = req.body.catagory;
    const final_delivery_date = req.body.date;
    const reciever_name = req.body.reciever_name;
    await managePackages.addPackage(username, package_name, weight, retail_center, status, final_delivery_date, dimentions, insurance_amount, catagory, reciever_name);
    res.redirect(`/user-page/${username}`);
});

app.post("/addPackage", async (req, res) => {
    const username = req.body.username;
    const package_name = req.body.package_name;
    const weight = req.body.weight;
    const retail_center = req.body.retail_center;
    const status = req.body.status;
    const dimentions = req.body.dimentions;
    const insurance_amount = req.body.insurance_amount;
    const catagory = req.body.catagory;
    const final_delivery_date = req.body.date;
    const reciever_name = req.body.reciever_name;
    await managePackages.addPackage(username, package_name, weight, retail_center, status, final_delivery_date, dimentions, insurance_amount, catagory, reciever_name);
    res.redirect("/admin");
});

app.post("/removePackage", async (req, res) => {
    const package_id = req.body.package_id;
    await managePackages.removePackage(package_id);
    res.redirect("/admin");
});

app.post("/editPackage", async (req, res) => {
    const package_id = req.body.package_id;
    const packageInfo = await managePackages.getPackageInfo(package_id);

    let package_name = req.body.package_name;
    if (package_name == '') package_name = packageInfo.package_name;
    let weight = req.body.weight;
    if (weight == '') weight = packageInfo.weight;
    let destination = req.body.destination;
    if (destination == '') destination = packageInfo.destination;
    let status = req.body.status;
    if (status == '') status = packageInfo.status;
    let dimentions = req.body.dimentions;
    if (dimentions == '') dimentions = packageInfo.dimensions;
    let insurance_amount = req.body.insurance_amount;
    if (insurance_amount == '') insurance_amount = packageInfo.insurance_amount;
    let catagory = req.body.catagory;
    if (catagory == '') catagory = packageInfo.catagory;
    let final_delivery_date = req.body.date;
    if (final_delivery_date == '') final_delivery_date = packageInfo.final_delivery_date;

    await managePackages.editPackage(package_id, package_name, weight, destination, status, final_delivery_date, dimentions, insurance_amount, catagory);
    res.redirect("/admin");
});
app.post('/user-page/:username/profile', async (req, res) => {
    const username = req.params.username;

    const userInfo = await auth.getUserInfoByUsername(username);
    let firstName = req.body.firstName;
    if (firstName == '') firstName = userInfo.firstName;
    let lastName = req.body.lastName;
    if (lastName == '') lastName = userInfo.lastName;
    let email = req.body.email;
    if (email == '') email = userInfo.email;
    let password = req.body.password;
    if (password == '') password = '12345';
    let hashedPassword = await bcrypt.hash(password, 8);


    await auth.editUser(email, username, hashedPassword, firstName, lastName);
    res.redirect(`/user-page/${username}`);
});
app.get("/user-page/:username/1/:package_id", async (req, res) => {
    const username = req.params.username;
    const package_id = req.params.package_id;
    const packageInfo = await managePackages.getPackageInfo(package_id);
    res.render("search-by-id", { packageInfo, userInfo: await auth.getUserInfoByUsername(username) });
});

app.get("/user-page/:username/2/:catagory", async (req, res) => {
    const username = req.params.username;
    const catagory = req.params.catagory;
    const packageInfo = await managePackages.getPackageInfoByCatagory(username, catagory);
    res.render("search-by-catagory", { packageInfo, userInfo: await auth.getUserInfoByUsername(username) });
});
app.get("/user-page/:username/3/:package_location", async (req, res) => {
    const username = req.params.username;

    const package_location = req.params.package_location;
    const packageInfo = await managePackages.getPackageInfoByLocation(username, package_location);
    res.render("search-by-location", { packageInfo, userInfo: await auth.getUserInfoByUsername(username) });
});
app.get("/user-page/:username/4/:date", async (req, res) => {
    const username = req.params.username;
    const date = req.params.date;
    const packageInfo = await managePackages.getPackageInfoByDate(username, date);
    res.render("search-by-date", { packageInfo, userInfo: await auth.getUserInfoByUsername(username) });
});
app.post("/user-page/:username", async (req, res) => {
    const username = req.params.username;

    if (typeof req.body.package_id != 'undefined') {
        const package_id = req.body.package_id;
        res.redirect(`/user-page/${username}/1/${package_id}`);
    }
    else if (typeof req.body.catagory != 'undefined') {
        const catagory = req.body.catagory;
        res.redirect(`/user-page/${username}/2/${catagory}`);
    }
    else if (typeof req.body.package_location != 'undefined') {
        const package_location = req.body.package_location;
        res.redirect(`/user-page/${username}/3/${package_location}`);
    } else if (typeof req.body.date != 'undefined') {
        const date = req.body.date;
        res.redirect(`/user-page/${username}/4/${date}`);
    } else {
        res.redirect(`/user-page/${username}`);
    }

});


app.post("/add-package-route", async (req, res) => {
    const package_id = req.body.package_id;
    const location = req.body.location;
    const date = req.body.date;
    const locationType = req.body.locationType;
    await managePackages.addPackageRoute(package_id, location, date, locationType);
    res.redirect("/admin");
});

app.post("/addUser", async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const admin = req.body.isAdmin;
    let hashedPassword = await bcrypt.hash(password, 8);
    await manageUsers.addUser(email, username, hashedPassword, admin);
    res.redirect("/admin");
});
app.post("/removeUser", async (req, res) => {
    const user_id = req.body.user_id;

    await manageUsers.removeUser(user_id);
    res.redirect("/admin");
});
app.post("/editUser", async (req, res) => {
    const user_id = req.body.user_id;
    const userInfo = await manageUsers.getUserInfo(user_id);
    let email = req.body.email;
    if (email == '') email = userInfo.email;
    let username = req.body.username;
    if (username == '') username = userInfo.username;


    let admin = req.body.isAdmin;
    if (admin == '') admin = userInfo.isAdmin;
    await manageUsers.editUser(user_id, email, username, admin);
    res.redirect("/admin");
});

app.post("/reports/status_catagory_report", async (req, res) => {
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const betweenDatesPackages = await managePackages.getLostPackagesBetweenDates(start_date, end_date);

    res.render("status_catagory_report", { betweenDatesPackages: betweenDatesPackages });
});

app.post("/reports/track-packages", async (req, res) => {
    const catagory = req.body.catagory;
    const location = req.body.location;
    const status = req.body.status;
    const track_packages = await managePackages.track_packages(catagory, location, status);

    res.render("track-packages", { track_packages: track_packages });
});
app.get("/user-page/:username/send-package", async (req, res) => {
    const username = req.params.username;
    res.render("send-package", { user: req.session.user, userInfo: await auth.getUserInfoByUsername(username), users: await manageUsers.getAllUsers() });
});



//logout route and redirect to index

app.get('/admin', async (req, res) => {
    const Allpackages = await auth.getAllPackages();
    const getAllUsers = await manageUsers.getAllUsers();

    res.render("admin", { user: req.session.user, Allpackages: Allpackages, getAllUsers: getAllUsers });
});

app.get('/admin/reports', async (req, res) => {
    const LostPackages = await auth.getLostPackages();

    res.render("reports", { user: req.session.user, LostPackages: LostPackages });
});

app.get('/admin/manage-packages', async (req, res) => {
    res.render("manage-packages", { user: req.session.user, users: await manageUsers.getAllUsers() });
});


app.get('/admin/send-email', async (req, res) => {
    res.render("send-email", { user: req.session.user });
});
app.get('/admin/manage-packages/remove-package', async (req, res) => {
    res.render("remove-package", { user: req.session.user });
});
app.get('/admin/manage-packages/edit-package', async (req, res) => {

    res.render("edit-package", { user: req.session.user });
});
app.get('/admin/manage-users', async (req, res) => {
    res.render("manage-users", { user: req.session.user });
});
app.get('/admin/manage-users/remove-user', async (req, res) => {
    res.render("remove-user", { user: req.session.user });
});

app.get('/admin/manage-users/edit-user', async (req, res) => {
    res.render("edit-user", { user: req.session.user });
});

app.get('/admin/package-route', async (req, res) => {
    res.render("package-route", { user: req.session.user });
});

app.get('/admin/reports/status_catagory_report', async (req, res) => {
    res.render("status_catagory_report", { user: req.session.user });
});
app.get('/admin/reports/trace-packages', async (req, res) => {
    res.render("trace-packages", { user: req.session.user });
});






//login routes



app.post("/", async (req, res) => {
    const logedPassword = req.body.password.toString();
    const email = req.body.email;
    const isAdmin = await auth.isAdmin(email);
    const info = await auth.authLogIn(email)

    if (info.email) {

        //validate password
        bcrypt.compare(logedPassword, info.password, async (err, result) => {
            if (result) {

                id = await auth.getUserID(email);

                req.session.authenticated = true;
                req.session.user = { id, email };
                if (isAdmin === 'true') {
                    res.redirect("/admin");


                }
                else
                    res.render("index", { userInfo: await auth.getUserInfo(email), user: req.session.user });

            }
            else {
                console.log('password not correct');
            }

        })
    } else res.render("login", { message: 'Password is not correct' });

});




app.listen(3000);