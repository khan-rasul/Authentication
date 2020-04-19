var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    connection    = require("./utils/database.js"),
    passport      = require("passport"),
    localStrategy = require("passport-local").Strategy,
    User          = require("./utils/user.js");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));

//========================
// PASSPORT CONFIGURATION
//========================
app.use(require("express-session")({
    secret: "This is a secret just between you and me",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(
    function(username , password , done){
        connection.promise().execute("SELECT * FROM users WHERE username = ?", [username])
        .then(([rows,fields])=>{
            if(!rows.length)
            {
                return done(null , false );
            }
            else{
                var user = new User(rows[0]);
                if(user.validatePassword(password))
                {
                    return done(null , user);
                }
                else
                {
                    return done(null , false);
                }
            }
        })
        .catch(err=> done(err));
    }
));
passport.serializeUser(function(user , done){
    done(null , user.username);
});
passport.deserializeUser(function(username , done){
    connection.promise().execute("SELECT * FROM users WHERE username = ?", [username])
        .then(([rows,fields])=>{
            done(null , rows[0]);
        })
        .catch(err=> done(err));
});

//============
// ROUTES
//============

// ROOT ROUTE
app.get("/", function(req, res){
    res.render("home");
});

// SHOW REGISTER FORM
app.get("/register", function(req , res){
    res.render("register");
});

// HANDLE REGISTER REQUEST
app.post("/register" , function(req, res, next){
    var user = new User({username : req.body.username});
    user.setPassword(req.body.password);
    connection.promise().execute("INSERT INTO users VALUES(? , ? , ?)",[user.username , user.salt , user.hash])
    .then(result=>{
        res.redirect('/');
    })
    .catch(err=>next(err));
})

// SHOW LOGIN FORM
app.get("/login" , function(req , res){
    res.render("login");
})

// HANDLE LOGIN LOGIC
app.post("/login", 
    passport.authenticate("local" , 
    {
        successRedirect : "/secret",
        failureRedirect : "/login"
    })
);

// LOGOUT ROUTE
app.get("/logout", function(req , res){
    req.logout();
    res.redirect("/");
})
// SHOW SECRET PAGE
app.get("/secret", isLoggedIn, function(req , res){
    res.render("secret");
});

// MIDDLEWARE
function isLoggedIn(req , res , next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
} 
// listen on port 3000
app.listen(3000 , function(){
    console.log("Server Started on port 3000. :)");
});