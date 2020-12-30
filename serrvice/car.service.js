const { CarModel } = require('../base/models');

module.exports = {
    getCars: () => CarModel().findAll(),

    getCarsByModel: (model) => CarModel.findAll({
        where: { model }
    }),

    createCar: (car, transaction) => CarModel.create(car, transaction),

    updateCar: (id, obj, transaction) => CarModel.update(
        { ...obj },
        { where: { id }, transaction }

    ),

    deleteCar: (id, transaction) => CarModel.destroy({
        where: { id },
        transaction
    }),
    getCarById: (id) => CarModel.findOne({
        where: id
    }),
};
