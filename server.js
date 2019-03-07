let express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');
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

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.disable('etag');

app.listen(port);

console.log('server running on localhost:' + port);
