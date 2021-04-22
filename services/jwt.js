const jwt = require('jsonwebtoken');

/**
 * A jsonwebtoken wrapper that converts them callback to Promise 
 * @param {x} payload
 * @returns {Promise} Promise with resolve: token and reject: err
 */
module.exports.signToken = function(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            }
        );
    })
}

/**
 * A JWT wrapper that converts them callback to Promise
 * @param {token} token from client
 * @returns {Promise} Promise with resolve: decoded payload and reject: err
 */
module.exports.decodeToken = function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}