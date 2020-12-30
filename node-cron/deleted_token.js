const { tokenService } = require('../serrvice');
const { CURRENT_DATE, DAY_IN_MS } = require('../constants/constans');
const { DELETE_TOKEN_DAYS } = require('../configs/config');

module.exports = async () => {
    const allToken = await tokenService.getAllToken();

    let numberOfDeletedToken = 0;

    for (const token of allToken) {
        const msUTC = Date.parse(token.created_at);
        const differenceDay = (CURRENT_DATE - msUTC) / DAY_IN_MS;

        if (Math.trunc(differenceDay) > DELETE_TOKEN_DAYS) {
            const deleted = tokenService.deleteToken(token.id);
            numberOfDeletedToken += 1;
        }
    }
    // await Promise.all(deleted);
};
