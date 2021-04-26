module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET,
        access: {
            expiredAt: 15, //15sec
        },
        refresh: {
            expiredAt: 30, //5min
        }
    }
}