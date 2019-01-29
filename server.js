let express = require('express'),
    bodyParser = require('body-parser');

/* routes */
let routes = require('./api/routes');

/* mongodb */
const {Connection} = require('./api/helper/mongodb');


let app = express();
let port = process.env.PORT || 3000;

/* models */
let Company = require('./api/model/Company');
let Applicant = require('./api/model/Applicant');

Connection.connectToMongo();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('server running on localhost:' + port);