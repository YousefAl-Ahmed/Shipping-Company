const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs")

const path = require('path');

//models
const auth = require('./models/auth');
// const plans = require('./models/plans');
const { render } = require("ejs");

//express app
const app = express();

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
    res.render("index", { user: req.session.user });
});

app.get("/:username", async (req, res) => {
    const username = req.params.username;
    res.render("user-page", { userInfo: await plans.getUser(username), user: req.session.user  });
});

//------------------register routes----------------------------
app.get("/register", async (req, res) => {
    res.render("register");
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




//login routes
app.get("/login", async (req, res) => {
    res.render("login");
});


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
                if(isAdmin==='true'){
                    res.render("admin", { user: req.session.user });
                }
                else
                res.render("index", { user: req.session.user });

            }

        })
    } else res.render("login", { message: 'Password is not correct' });

});



app.listen(3000);