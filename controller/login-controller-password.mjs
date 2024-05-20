import bcrypt from 'bcrypt';
import * as userModel from '../model/sqlite-async/task-list-model-sqlite-async.mjs';

export let showLogInForm = function (req, res) {
    res.render('login-password', { model: process.env.MODEL });
}

export let showRegisterForm = function (req, res) {
    res.render('register-password', {});
}

export let doRegister = async function (req, res) {
    try {
        const registrationResult = await userModel.registerUser(req.body.username, req.body.password);
        if (registrationResult.message) {
            res.render('register-password', { message: registrationResult.message });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('registration error: ' + error);
        res.render('register-password', { message: error });
    }
}

export let doLogin = async function (req, res) {
    const user = await userModel.getUserByUsername(req.body.username);
    if (!user || !user.password || !user.id) {
        res.render('login-password', { message: 'Δε βρέθηκε αυτός ο χρήστης' });
    } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.loggedUserId = user.id;
            const redirectTo = req.session.originalUrl || "/tasks";
            res.redirect(redirectTo);
        } else {
            res.render('login-password', { message: 'Ο κωδικός πρόσβασης είναι λάθος' });
        }
    }
}

export let doLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

export let checkAuthenticated = function (req, res, next) {
    if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        next();
    } else {
        if (req.originalUrl === "/login" || req.originalUrl === "/register") {
            next();
        } else {
            console.log("not authenticated, redirecting to /login");
            res.redirect('/login');
        }
    }
}
