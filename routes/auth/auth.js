const rootPath = require('app-root-path');
const keystone = require('keystone');
const validator = require('validator');
const User = keystone.list('User').model;
const Token = keystone.list('Token').model;
const { updateTokens, refreshTokens } = require(rootPath + "/services/jwt.js");
const bcrypt = require('bcrypt');

const router = keystone.createRouter();

const asyncHandler = fn => (req, res, next) => {
    Promise
        .resolve(fn(req, res, next))
        .catch(next);
}

router.post('/api/auth/reg', [validateSignUp, findUserByEmail, asyncHandler(createUser)],
    (req, res) => {
        const tokens = updateTokens(req.user._id);
        res.status(201).json({ tokens });
    });

router.post('/api/auth', [validateSignIn, findUserByEmail, asyncHandler(login)],
    (req, res) => {
        const tokens = updateTokens(req.user._id);
        res.status(200).json({ tokens });
    });

router.get('/api/user', [],
    (req, res) => {
        User.find({})
            .exec()
            .then(users => res.status(200).json({ users }))
            .catch(err => res.status(500).json({ msg: err }));
    });

router.delete('/api/user', [],
    (req, res) => {
        User.deleteMany({})
            .exec()
            .then(() => res.sendStatus(204))
            .catch(err => res.status(500).json({ msg: err }));
    });

router.get('/api/token', [],
    (req, res) => {
        Token.find({})
            .exec()
            .then(tokens => res.status(200).json({ tokens }))
            .catch(err => res.status(500).json({ msg: err }));
    });

router.put('/api/token', [],
    (req, res) => {
        refreshTokens(req.body.refreshToken)
        .then(tokens => res.status(200).json({ tokens }))
        .catch(msg => res.status(400).json({ msg }));
    });

router.delete('/api/token', [],
    (req, res) => {
        Token.deleteMany({})
            .exec()
            .then(() => res.sendStatus(204))
            .catch(err => res.status(500).json({ msg: err }));
    });

function validateSignUp(req, res, next) {
    const body = { name: '', password: '', email: '' };
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

function findUserByEmail(req, res, next) {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => next(err));
}

async function createUser(req, res, next) {
    if (req.user) {
        return res.status(400).json({
            msg: `Пользователя с почтой:${req.body.email} уже существует`,
        });
    }

    const newUser = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    });

    await newUser.save()
        .then(user => req.user = user)
        .catch(err => next(err));

    next();
}

function validateSignIn(req, res, next) {
    const body = { email: '', password: '' };
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

async function login(req, res, next) {
    if (!req.user) {
        return res.status(400).json({
            msg: `Пользователя с почтой:${req.body.email} не существует`,
        });
    }
    const isMatch = await bcrypt.compare(req.body.password, req.user.password);
    if (!isMatch) {
        return res.status(401).json({
            msg: 'Неправильный пароль',
        });
    }

    next();
}

module.exports = router;