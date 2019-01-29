let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    config = require('./config');

/* routes */
let routes = require('./api/routes/companyRoute');

/* models */
let Company = require('./api/model/Company');

let app = express();
let port = process.env.PORT || 3000;

/* Mongo instance */
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app);
app.listen(port);


console.log('server running on : ' + port);