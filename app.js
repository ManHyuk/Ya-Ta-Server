'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');





const app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json('50mb'));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


require('./routes')(app);





// Server Port Set
const PORT = 3000;
app.listen(PORT, () => {
  console.info(`[YaTa] Application Listening on Port ${PORT}`);
});



module.exports = app;
