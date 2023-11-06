const express = require('express');
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const PORT = process.env.PORT || 3000;

const routes = require('./routes/routes');

require('dotenv').config();

app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true
}))

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})