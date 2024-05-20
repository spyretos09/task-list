import { Task as MyTask } from '../model/task.js';
import * as model from '../model/sqlite-async/task-list-model-sqlite-async.mjs';

export async function listAllTasksRender(req, res, next) {
   const userId = req.session.loggedUserId;
   try {
      const tasks = await model.getAllTasks(userId);
      res.render('tasks', { tasks: tasks, model: process.env.MODEL, session: req.session });
   } catch (error) {
      next(error); // Pass the error to the next middleware
   }
}

export async function addTask(req, res, next) {
   const newTask = new MyTask(null, req.query.taskName);
   try {
      const lastInsertId = await model.addTask(newTask, req.session.loggedUserId);
      const allTasks = await model.getAllTasks(req.session.loggedUserId);
      res.render('tasks', { tasks: allTasks, model: process.env.MODEL, session: req.session });
   } catch (error) {
      next(error); // Pass the error to the next middleware
   }
}

export async function toggleTask(req, res, next) {
   try {
      await model.toggleTask(req.params.toggleTaskId, req.session.loggedUserId);
      const allTasks = await model.getAllTasks(req.session.loggedUserId);
      res.render('tasks', { tasks: allTasks, model: process.env.MODEL });
   } catch (error) {
      next(error); // Pass the error to the next middleware
   }
}

export async function removeTask(req, res, next) {
   try {
      await model.removeTask(req.params.removeTaskId, req.session.loggedUserId);
      const allTasks = await model.getAllTasks(req.session.loggedUserId);
      res.render('tasks', { tasks: allTasks, model: process.env.MODEL });
   } catch (error) {
      next(error); // Pass the error to the next middleware
   }
}
