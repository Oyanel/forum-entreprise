let express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    session = require('express-session'),
    passport = require('passport');


require('./api/config/passport')(passport);

/* routes */
let routes = require('./api/routes');

/* mongodb */
const {Connection} = require('./api/helper/mongodb');

let app = express(),
    port = process.env.PORT || 3000;

/* models */
let User = require('./api/model/User'),
    Meeting = require('./api/model/Meeting');

Connection.connectToMongo();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: config.passport.secretKey,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('server running on localhost:' + port);
