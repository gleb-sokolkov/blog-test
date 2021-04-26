const keystone = require('keystone');
const { default: validator } = require('validator');
const User = keystone.list('User');
const bcrypt = require('bcrypt');
const rootPath = require('app-root-path');
const { signToken, signRefreshToken } = require(rootPath + "/services/jwt");
const config = require(rootPath + "/app.config.js");

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'signin';

    /**
     * POST request body schema:
     * {
     *      password: String,
     *      email: String,
     * }
     */
    const body = { email: '', password: '' };
    /*view.on('post', validateSignIn);
    view.on('post', getUser);
    view.on('post', login);*/
    view.on('post', (next) => {signRefreshToken(); res.sendStatus(200)});

    view.render('signin', { layout: 'info' });

    function validateSignIn(next) {
        req.body = Object.assign(body, req.body);
        const arr = [];
        arr.push(
            !validator.isStrongPassword(req.body.password),
            !validator.isEmail(req.body.email),
        );
        if (arr.some(item => item)) {
            return res.status(422).json({
                msg: 'Проверьте введенные данные',
            });
        }

        next();
    }

    function getUser(next) {
        User.model.findOne({ email: req.body.email }).exec((err, user) => {
            if (err) {
                next(err);
            }
            if (!user) {
                return res.status(400).json({
                    msg: `Пользователя с почтой:${req.body.email} не существует`,
                });
            }
            req.user = user;
            next();
        });
    }

    function login(next) {
        const isMatch = bcrypt.compareSync(req.body.password, req.user.password);
        if (!isMatch) {
            return res.status(401).json({
                msg: 'Неправильный пароль',
            });
        }

        signToken({ id: req.user.id })
        .then(token => res.status(200).json({
            token,
        }))
        .catch(err => next(err));

        signToken({id: req.user.id})
        .then(token => res.status(200).cookie('refresh token', 'Bearer ' + token, {
            expires: new Date(Date.now() + config.jwt.refresh.expiredAt * 1000)
        }).end())
        .catch();
    }
};