const uuid = require('uuid').v1();
const fs = require('fs-extra').promises;
const path = require('path');

const { ACTION_CREATED_CAR, ACTION_UPDATE_CAR, ACTION_DELETE_CAR } = require('../../constants/constans');
const { CREATED, NO_CONTENT } = require('../../configs/status-codes');
const { carsServices, fileService, logMongoService } = require('../../serrvice');
const { sequelize } = require('../../base');

module.exports = {
    getAllCars: async (req, res, next) => {
        try {
            const cars = await carsServices.getCars();

            res.json(cars);
        } catch (e) {
            next(e);
        }
    },

    getOneCarsByModel: async (req, res, next) => {
        try {
            const { model } = req.params;

            const car = await carsServices.getCarsByModel(model);

            res.json(car);
        } catch (e) {
            next(e);
        }
    },

    createCar: async (req, res, next) => {
        const transaction = await sequelize.transaction();

        try {
            const {
                photos, docs, body: { car }, params: { userId }
            } = req;

            const newCar = await carsServices.createCar(car, transaction);

            if (photos) {
                const photoDir = `users/${userId}/cars/${newCar.id}/photos`;

                for (const photo of photos) {
                    const fileExtension = photo.name.split('.').pop();
                    const photoName = `${uuid}.${fileExtension}`;

                    fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true })
                        .then(() => photo.mv(path.resolve(process.cwd(), 'public', photoDir, photoName)))
                        .then(() => {
                            const filePath = path.join(photoDir, photoName);
                            fileService.createFiles({
                                type: fileExtension, file: filePath, user_id: userId
                            },
                            newCar.id, transaction);
                        });
                }
            }

            if (docs) {
                const photoDir = `users/${userId}/cars/${newCar.id}/docs`;

                for (const doc of docs) {
                    const fileExtension = doc.name.split('.').pop();
                    const docName = `${uuid}.${fileExtension}`;

                    fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true })
                        .then(() => doc.mv(path.resolve(process.cwd(), 'public', photoDir, docName)))
                        .then(() => {
                            const filePath = path.join(photoDir, docName);
                            fileService.createFiles({
                                type: fileExtension, file: filePath, user_id: userId
                            },
                            newCar.id, transaction);
                        });
                }
            }
            await transaction.commit();

            const action = {
                user_id: userId,
                actions: ACTION_CREATED_CAR,
                car_id: newCar.id
            };
            await logMongoService.addLogAction(action);

            res.status(CREATED).json(newCar);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    updateCar: async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const {
                photos, docs, body: { updateCar }, params: { userId, id }
            } = req;

            const db = await carsServices.updateCar(id, updateCar, transaction);
            if (photos) {
                const photoDir = `users/${userId}/cars/${id}/photos`;

                for (const photo of photos) {
                    const fileExtension = photo.name.split('.').pop();
                    const photoName = `${uuid}.${fileExtension}`;

                    fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true })
                        .then(() => photo.mv(path.resolve(process.cwd(), 'public', photoDir, photoName)))
                        .then(() => {
                            const filePath = path.join(photoDir, photoName);
                            fileService.createFiles({ type: fileExtension, file: filePath, user_id: userId }, id, transaction);
                        });
                }
            }

            if (docs) {
                const photoDir = `users/${userId}/cars/${id}/docs`;

                for (const doc of docs) {
                    const fileExtension = doc.name.split('.').pop();
                    const docName = `${uuid}.${fileExtension}`;

                    fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true })
                        .then(() => doc.mv(path.resolve(process.cwd(), 'public', photoDir, docName)))
                        .then(() => {
                            const filePath = path.join(photoDir, docName);
                            fileService.createFiles({ type: fileExtension, file: filePath, user_id: userId }, id, transaction);
                        });
                }
            }
            await transaction.commit();

            const action = {
                user_id: userId,
                actions: ACTION_UPDATE_CAR,
                car_id: id
            };
            await logMongoService.addLogAction(action);

            res.status(CREATED).json(db);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    deleteCar: async (req, res, next) => {
        const transaction = await sequelize.transaction();

        try {
            const { userId, id } = req.params;
            const car = await carsServices.deleteCar(id, transaction);

            await transaction.commit();
            const action = {
                user_id: userId,
                actions: ACTION_DELETE_CAR,
                car_id: id
            };
            await logMongoService.addLogAction(action);

            res.status(NO_CONTENT).json(car);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },
};
