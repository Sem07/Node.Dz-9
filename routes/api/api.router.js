const { Router } = require('express');

const authRouter = require('../auth/auth.router');
const carsRouter = require('../car/car.router');
const usersRouter = require('../user/user.router');
const emailRouter = require('../email/email.router');
const productRouter = require('../products/products.router')

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/cars', carsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/', emailRouter);
apiRouter.use('/product', productRouter);
module.exports = apiRouter;
