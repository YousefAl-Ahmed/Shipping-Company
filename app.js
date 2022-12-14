
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

    res.render("index", { userInfo: await auth.getUserInfo(email), user: req.session.user });
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

app.get("/user-page/:username", async (req, res) => {
    const username = req.params.username;
    const email = req.body.email;

    const packages = await auth.getUserPackages(username);
    res.render("user-page", { packages: packages, user: req.session.user, userInfo: await auth.getUserInfo(email) });
});

app.post("/auth", async (req, res) => {


    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;



    let hashedPassword = await bcrypt.hash(password, 8);

    const info = await auth.authUser(email, username)
    if (info === undefined) {
        await auth.addUser(email, username, hashedPassword, false);

        res.redirect("/login");
    } else res.render("register", { message: "not unique" })
});

app.post("/addPackage", async (req, res) => {
    const username = req.body.username;
    const package_name = req.body.package_name;
    const weight = req.body.weight;
    const destination = req.body.destination;
    const status = req.body.status;
    const dimentions = req.body.dimentions;
    const insurance_ammount = req.body.insurance_amount;
    const catagory = req.body.catagory;
    const final_delivery_date = req.body.date;
    await managePackages.addPackage(username, package_name, weight, destination, status,final_delivery_date, dimentions, insurance_ammount, catagory);
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
    console.log(packageInfo.username);
    console.log(packageInfo.dimensions);

    let package_name = req.body.package_name;
    if (package_name == '') package_name = packageInfo.package_name;
    let weight = req.body.weight;
    if (weight == '') weight = packageInfo.weight;
    let destination = req.body.destination;
    if (destination == '') destination = packageInfo.destination;
    let status = req.body.status;
    if (status == '') status = packageInfo.status;
    let dimentions = req.body.dimentions;
    if(dimentions == '') dimentions = packageInfo.dimensions;
    let insurance_ammount = req.body.insurance_amount;
    if(insurance_ammount == '') insurance_ammount = packageInfo.insurance_amount;
    let catagory = req.body.catagory;
    if(catagory == '') catagory = packageInfo.catagory;
    let final_delivery_date = req.body.date;
    if(final_delivery_date == '') final_delivery_date = packageInfo.final_delivery_date;
    
    await managePackages.editPackage(package_id, package_name, weight, destination, status,final_delivery_date, dimentions, insurance_ammount, catagory);
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


    

//logout route and redirect to index

app.get('/admin', async (req, res) => {
    const Allpackages = await auth.getAllPackages();
    const getAllUsers = await manageUsers.getAllUsers();

    res.render("admin", { user: req.session.user, Allpackages: Allpackages, getAllUsers: getAllUsers });
});

app.get('/admin/reports', async (req, res) => {
    const LostPackages = await auth.getLostPackages();

    res.render("reports", { user: req.session.user, LostPackages: LostPackages});
});

app.get('/admin/manage-packages', async (req, res) => {
    res.render("manage-packages", { user: req.session.user });
});

app.get('/admin/manage-users', async (req, res) => {
    res.render("manage-users", { user: req.session.user });
});

app.get('/admin/send-email', async (req, res) => {
    res.render("send-email", { user: req.session.user });
});
app.get('/admin/manage-packages/remove-package', async (req, res) => {
    res.render("remove-package", { user: req.session.user });
});
app.get('/admin/manage-packages/edit-package', async (req, res) => {

    res.render("edit-package", {user: req.session.user });
});






//login routes



app.post("/", async (req, res) => {
    const logedPassword = req.body.password.toString();
    const email = req.body.email;
    const isAdmin = await auth.isAdmin(email);
    console.log(isAdmin);
    const info = await auth.authLogIn(email)

    if (info.email) {
        //validate password
        bcrypt.compare(logedPassword, info.password, async (err, result) => {
            if (result) {
                id = await auth.getUserID(email);

                req.session.authenticated = true;
                req.session.user = { id, email };
                if (isAdmin === 'true') {
                    res.render("admin", { user: req.session.user });
                }
                else
                    res.render("index", { userInfo: await auth.getUserInfo(email), user: req.session.user });

            }

        })
    } else res.render("login", { message: 'Password is not correct' });

});




app.listen(3000);