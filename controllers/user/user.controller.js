const uuid = require('uuid').v1();
const fs = require('fs-extra').promises;
const path = require('path');

const { ACTIVATE_USER_ACCOUNT, DELETE_USER } = require('../../constants/emailAction.enum');
const { ACTION_DELETE_USER, ACTION_UPDATE_USER, ACTION_REGISTERED_USER } = require('../../constants/constans');
const { CREATED, NO_CONTENT } = require('../../configs/status-codes');
const { passwordHash } = require('../../utils');
const { userServices, emailServices, logMongoService } = require('../../serrvice');
const { sequelize } = require('../../base');

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userServices.getUsers();

            res.json(users);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const user = req.body;
            const [avatar] = req.photos;

            user.password = await passwordHash(user.password);
            const newUser = await userServices.createUser(user, transaction);

            if (avatar) {
                const photoDir = `users/${newUser.id}/photos`;
                const fileExtension = avatar.name.split('.').pop();
                const photoName = `${uuid}.${fileExtension}`;

                await fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true });
                await avatar.mv(path.resolve(process.cwd(), 'public', photoDir, photoName));

                await userServices.updateUser(newUser.id, { photo: `${photoDir}/${photoName}` }, transaction);
            }

            await emailServices.sendMail(user.email, ACTIVATE_USER_ACCOUNT, {
                userEmail: user.email,
                userName: user.login
            });

            await transaction.commit();

            const action = {
                user_id: newUser.id,
                actions: ACTION_REGISTERED_USER
            };
            await logMongoService.addLogAction(action);

            res.status(CREATED).json(newUser);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    getOneUsers: async (req, res, next) => {
        try {
            const { userId } = req.params;

            const user = await userServices.getUserById(userId);

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const { email } = req.params;

            const user = await userServices.deletedUser(email, transaction);

            await emailServices.sendMail(email, DELETE_USER, {
                userEmail: email
            });

            await transaction.commit();

            const action = {
                user_id: user.id,
                actions: ACTION_DELETE_USER
            };
            await logMongoService.addLogAction(action);

            res.status(NO_CONTENT).json(`User delete: ${user}`);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const updateUser = req.body;
            const [avatar] = req.photos;
            const { id } = req.params;
            if (avatar) {
                const photoDir = `users/${id}/photos`;
                const fileExtension = avatar.name.split('.').pop();
                const photoName = `${uuid}.${fileExtension}`;

                await fs.mkdir(path.resolve(process.cwd(), 'public', photoDir), { recursive: true });
                await avatar.mv(path.resolve(process.cwd(), 'public', photoDir, photoName));

                await userServices.updateUser(id, { photo: `${photoDir}/${photoName}` }, transaction);
            }

            const db = await userServices.updateUser(id, updateUser, transaction);

            await transaction.commit();

            const action = {
                user_id: id,
                actions: ACTION_UPDATE_USER
            };
            await logMongoService.addLogAction(action);

            res.status(CREATED).json(db);
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    },
};
