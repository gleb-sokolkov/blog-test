const rootPath = require('app-root-path');
const captcha = require(rootPath + '/services/captcha/captcha.js');

const assert = require('assert').strict;

describe('captcha test', () => {
    it('should be rejected when body is null', async () => {
        const [body, remoteAddress] = [null, null];
        const valid = await captcha(body, remoteAddress).catch(item => item);
        assert.deepEqual(valid, { type : 'empty' });
    });
    it('should be rejected when body contains incorrect data', async () => {
        const [body, remoteAddress] = ['incorrect captcha', null];
        const valid = await captcha(body, remoteAddress).catch(item => item);
        assert.deepEqual(valid, { type: 'invalid' });
    });
});