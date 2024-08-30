const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({ origin: `${process.env.CORS_ORIGIN}${process.env.PORT}` }));
app.use(cors({
    origin : '*',
    methods : ['POST', 'PUT', 'PATCH', 'DELETE', 'UPDATE', 'GET']
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/images')));
app.use(cookieParser());
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    name : 'sessionId',   // giving the custom name to prevent powered by attacks like we don't want attackers to know that what technology(express) we are using node as the default name is connect.sid
    cookie : {
        secure : false, // // if true : only transmit cookie over https
        httpOnly : true,
        maxAge : 1000 * 60 * 30 // 30 minutes
    }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Routes 
const indexRoutes = require('./routes/indexRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/',indexRoutes);
app.use('/api',apiRoutes);

module.exports = app;