module.exports = {
    EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
    LOGIN: /^[A-z0-9_-]{3,16}$/,
    PASSWORD: /^(?!.* )(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[@$!%*#?&]).{8,}$/
};
