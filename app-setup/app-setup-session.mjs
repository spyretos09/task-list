// Example of app-setup-session.mjs
import session from 'express-session';

const taskListSession = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
});

export default taskListSession;
