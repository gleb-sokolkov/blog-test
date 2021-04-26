const jwt = require('jsonwebtoken');
const rootPath = require('app-root-path');
const config = require(rootPath + '/app.config.js');
const keystone = require('keystone');
const Token = keystone.list('Token').model;
const mongoose = require('mongoose');

/**
 * Creates refresh token with tokenID payload
 * @returns {Object} object with id and token
 */
function signRefreshToken() {
    const uuid = mongoose.Types.ObjectId().toHexString();
    const payload = { uuid };
    const token = jwt.sign(
        payload,
        config.jwt.secret,
        { expiresIn: config.jwt.refresh.expiredAt }
    );

    return { uuid, token };
}

/**
 * Creates access token with userID payload
 * @param {userID} user id from db 
 * @returns {String} token in hex-string format
 */
function signAccessToken(userID) {
    const payload = { id: userID };
    const token = jwt.sign(
        payload,
        config.jwt.secret,
        { expiresIn: config.jwt.access.expiredAt },
    );
    return token;
}

/**
 * Updates Token document with refresh tokens
 * @param {Number} user id from db 
 * @returns {void} 
 */
async function updateDBToken(uuid, userID) {
    const token = await Token.findOne({ userID });
    if (token) {
        token.uuid = uuid;
        await token.save();
    }
    else {
        createRefreshToken(uuid, userID);
    }
}

/**
 * Creates new refresh token, then record to db
 * @param {Number} some payload as userID
 * @returns {Number} tokenID   
 */
function createRefreshToken(uuid, userID) {
    return Token.create({ uuid, userID });
}

/**
 * Creates new refresh and access tokens, then update Token document
 * @param {Number} user ID from db 
 * @returns 
 */
function updateTokens(userID) {
    const accessToken = signAccessToken(userID);
    const refreshToken = signRefreshToken();
    updateDBToken(refreshToken.uuid, userID);
    return {
        accessToken,
        refreshToken: refreshToken.token
    };
}

/**
 * Takes token from Authorization data that received from request header
 * @param {req} client request object
 * @returns {Object} payload
 */
function getTokenFromHeader(req) {
    return req.headers.authorization && req.headers.authorization.split(' ')[1];
}

/**
 * Refreshes both tokens and eventually update DB
 * @param {String} refresh refresh token
 * @returns {Promise} promise with both tokens in json format
 */
function refreshTokens(refresh) {
    return verifyToken(refresh)
    .then(payload => {
        return Token.findOne({ uuid : payload.uuid });
    })
    .then(token => {
        if(!token) {
            throw "Такого токена не существует";
        }
        return updateTokens(token.userID);
    });
}

/**
 * A jwt wrapper that converts its verify() with callback to a promise
 * @param {String} token encoded token, received from client 
 * @returns {Promise<Object, Error>} 
 */
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwt.secret, (err, payload) => {
            if(err) {
                reject(err);
            }
            resolve(payload);
        });
    });
}


module.exports = {
    signAccessToken,
    signRefreshToken,
    updateDBToken,
    getTokenFromHeader,
    updateTokens,
    refreshTokens,
    verifyToken,
};

//TODO: добавить рефреш токен при аутентификации который должен храниться в куке, а аксесс просто отправляем json'ом
//рефреш токен нужно положить при аутентификации в бд. Payload рефреша это сгенеренный рандомный id просто чтобы они были разные. Добавить эндпоинт /token где будет
