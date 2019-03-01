const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
port = process.env.PORT || 3000;

/*-----------------------------Cross-origin resource sharing Start-------------------------*/ 
var cors = require('cors')

var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
    'http://localhost:3000'
];
// var originsWhitelist = [
//     'http://subscriptionmanagement.s3-website.ca-central-1.amazonaws.com',      //this is my front-end url for development
//     'http://localhost:3000'
// ];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}

app.use(cors(corsOptions))
/*-----------------------------Cross-origin resource sharing End-------------------------*/


/*-----------------------------Cross-origin resource sharing Start-------------------------*/ 
// var cors = require('cors')

// var originsWhitelist = [
//     'http://localhost:4200',      //this is my front-end url for development
//     'http://localhost:3000'
// ];
// var corsOptions = {
//     origin: function (origin, callback) {
//         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//         callback(null, isWhitelisted);
//     },
//     credentials: true
// }

// app.use(cors(corsOptions))
/*-----------------------------Cross-origin resource sharing End-------------------------*/

// const mysql = require('mysql');
// // connection configurations
// const mc = mysql.createConnection({
//     host: '192.168.1.104',
//     user: 'root',
//     password: 'root',
//     database: 'nodejs'
// });

// // connect to database
// mc.connect();

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route


//Cron job

var cron = require('node-cron');
 
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');

  const fs = require('fs');
const path = require('path');

let filename = 'subscription-details.csv';
let src = path.join(__dirname+"/app/model/", filename);
let destDir = path.join("//192.168.1.101/Common Drive", 'FUSEBILL');


fs.access(destDir, (err) => {
  if(err)
    fs.mkdirSync(destDir);

  copyFile(src, path.join(destDir, filename));
});


function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}

});