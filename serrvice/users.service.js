const { UserModel, CarModel } = require('../base/models');

module.exports = {
    getUserById: (id) => CarModel.findAll({
        where: { users_id: id },
        include: [{ model: UserModel, as: 'user' }]
    }),

    getUsers: () => UserModel.findAll(),

    deletedUser: async (email, transaction) => {
        await UserModel.destroy({
            where: { email },
            transaction
        });
    },

    createUser: (user, transaction) => UserModel.create(user, { transaction }),

    updateUser: (id, obj, transaction) => UserModel.update(
        { ...obj },
        {
            where: { id }, returning: true, plain: true, transaction
        }
    ),

    getUserByEmail: async (data) => {
        const user = await UserModel.findOne({
            where: data
        });
        return user && user.dataValues;
    },
};
