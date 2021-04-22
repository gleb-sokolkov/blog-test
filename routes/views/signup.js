const keystone = require('keystone');
const validator = require('validator');
const User = keystone.list('User');
const bcrypt = require('bcrypt');
const rootPath = require('app-root-path');
const { signToken, decodeToken } = require(rootPath + '/services/jwt');
const middleware = require("../middleware");

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = "signup";

    /*
    POST request body schema: 
    {
        name: string,
        password: string,
        email: string,
    }
    */
    const body = { name: '', password: '', email: '' };
    view.on('post', validateSignUp);
    view.on('post', userExists);
    view.on('post', createUser);
    view.on('get', (next) => middleware.auth(req, res, next));
    view.on('get', getAll);


    view.render('signup', { layout: 'info' });

    function validateSignUp(next) {
        req.body = Object.assign(body, req.body);
        const arr = [];
        arr.push(
            validator.isEmpty(req.body.name),
            !validator.isStrongPassword(req.body.password),
            !validator.isEmail(req.body.email),
        );

        if (arr.some(item => item)) {
            return res.status(422).json({
                msg: "Проверьте введенные данные",
            });
        }

        next();
    }

    function userExists(next) {
        User.model.findOne({ email: req.body.email }).exec((err, user) => {
            if (err) {
                next(err);
            }
            if (user) {
                return res.status(400).json({
                    msg: `Пользователь с почтой: ${req.body.email} уже существует`,
                });
            }

            next();
        });
    }

    function createUser(next) {
        const user = new User.model({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        });

        user.save()
            .then(user => signToken({ id: user.id }))
            .then(token => res.status(201).json({ token }))
            .catch(err => next(err));
    }

    function getAll(next) {
        User.model.find().sort('name').exec((err, result) => {
            if (err) {
                next(err);
            }
            res.status(200).json(result);
        });
    }
    
    function me(next) {
        User.model.findById(req.user.id).exec((err, user) => {
            if(err){
                next(err);
            }
            if(user) {
                return res.status(200).json(user);
            }

            next();
        });
    }

    function deleteAll(next) {
        User.model.deleteMany({}).exec((err) => {
            if(err) {
                next(err);
            }
            return res.status(200).json({
                msg: "Все пользователи очищены!",
            });
        });
    }
};
