const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');

const { apiRouter } = require('./routes');
const { config: { PORT } } = require('./configs');
const { sequelize } = require('./base');

dotenv.config();

const app = express();

connectDB();

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', (err, req, res, next) => {
    res
        .status(err.code)
        .json({
            message: err.message,
            ok: false
        });
});
(async () => {
    await sequelize.sync({ alter: true });
    app.listen(PORT, (err) => err && console.log(err) || console.log(`Listen ${PORT} ...`));
})();

function connectDB() {
    mongoose.connect('mongodb://localhost:27017/product', { useNewUrlParser: true });
    const connect = mongoose.connection;
    connect.on('error', (error) => {
        console.log(error);
    });
}
