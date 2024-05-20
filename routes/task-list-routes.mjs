import express from 'express';
const router = express.Router();

import * as taskListController from '../controller/task-list-controller.mjs';
import * as logInController from '../controller/login-controller-password.mjs';

// Root route
router.route('/').get((req, res) => {
    res.redirect('/tasks');
});

// Task routes with authentication middleware
router.get('/tasks/remove/:removeTaskId', logInController.checkAuthenticated, taskListController.removeTask);
router.get('/tasks/toggle/:toggleTaskId', logInController.checkAuthenticated, taskListController.toggleTask);
router.get('/tasks', logInController.checkAuthenticated, taskListController.listAllTasksRender);
router.get('/tasks/add/', logInController.checkAuthenticated, taskListController.addTask);

// Login routes
router.route('/login')
    .get(logInController.showLogInForm)
    .post(logInController.doLogin);

// Logout route
router.route('/logout')
    .get(logInController.doLogout);

// Register routes
router.route('/register')
    .get(logInController.showRegisterForm)
    .post(logInController.doRegister);

export default router;
