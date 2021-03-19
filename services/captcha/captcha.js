const fetch = require('node-fetch');

/**
 * Resolve.
 *
 * @param {String} captcha Captcha from client.
 * @param {String} remoteAddress Remote address of client.
 * @return {Promise} Promise with empty resolve and reject with types: 'empty', 'invalid'.
 */
module.exports = (captcha, remoteAddress) => {
    return new Promise((resolve, reject) => {

        if (captcha === undefined ||
            captcha === '' ||
            captcha === null) {
            reject({ type: 'empty' });
        }

        const secret = (process.env.APP_STATE === "dev") ? process.env.TRECAPTCHA_SECRET_KEY : process.env.RECAPTCHA_SECRET_KEY;
        const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${remoteAddress}`;

        fetch(verifyURL)
            .then(res => res.json())
            .then(body => {
                if (body.success !== undefined && !body.success) {
                    reject({type: 'invalid'});
                }
                else {
                    resolve();
                }
            });
    });
};