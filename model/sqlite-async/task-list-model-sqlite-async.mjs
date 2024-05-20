'use strict';

import { Database } from 'sqlite-async';
import bcrypt from 'bcrypt';

let sql;
try {
    sql = await Database.open('model/db/tasks.sqlite');
} catch (error) {
    throw Error('Δεν ήταν δυνατό να ανοίξει η βάση δεδομένων.' + error);
}

export let getAllTasks = async (userId) => {
    try {
        const stmt = await sql.prepare("SELECT * FROM task WHERE user_id = ?");
        const tasks = await stmt.all(userId);
        return tasks;
    } catch (err) {
        throw err;
    }
}


export let getTask = async (taskId, userId) => {
    const stmt = await sql.prepare("SELECT * FROM task WHERE id = ? AND user_id = ? LIMIT 0, 1");
    try {
        const task = await stmt.all(taskId, userId);
        return task;
    } catch (err) {
        throw err;
    }
}

export let addTask = async (newTask, userId) => {
    const stmt = await sql.prepare('INSERT INTO task VALUES (null, ?, ?, CURRENT_TIMESTAMP, ?)');
    try {
        const info = await stmt.run(newTask.task, newTask.status, userId);
        return info.lastInsertRowid;
    } catch (err) {
        throw err;
    }
}

export let toggleTask = async (taskId, userId) => {
    const stmt = await sql.prepare('UPDATE task SET status = CASE WHEN status = 0 THEN 1 ELSE 0 END WHERE id = ? AND user_id = ?');
    try {
        await stmt.run(taskId, userId);
        return true;
    } catch (err) {
        throw err;
    }
}

export let removeTask = async (taskId, userId) => {
    const stmt = await sql.prepare("DELETE FROM task WHERE id = ? AND user_id = ?");
    try {
        await stmt.run(taskId, userId);
        return true;
    } catch (err) {
        throw err;
    }
}

export let getUserByUsername = async (username) => {
    const stmt = await sql.prepare("SELECT id, username, password FROM user WHERE username = ? LIMIT 0, 1");
    try {
        const user = await stmt.all(username);
        return user[0];
    } catch (err) {
        throw err;
    }
}

export let registerUser = async function (username, password) {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" };
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const stmt = await sql.prepare('INSERT INTO user VALUES (null, ?, ?)');
            const info = await stmt.run(username, hashedPassword);
            return { lastID: info.lastInsertRowid };
        } catch (error) {
            throw error;
        }
    }
}
