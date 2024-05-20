import express from 'express';
const app = express();

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
   dotenv.config();
}

import exphbs from 'express-handlebars';

// Middleware for parsing POST requests
app.use(express.urlencoded({ extended: false }));

// Import and enable session middleware
import taskListSession from './app-setup/app-setup-session.mjs';
app.use(taskListSession);

// Serve static files
app.use(express.static('public'));

// Middleware to set res.locals.userId
app.use((req, res, next) => {
   if (req.session) {
      res.locals.userId = req.session.loggedUserId;
   } else {
      res.locals.userId = 'επισκέπτης';
   }
   next();
});

// Import and use routes
import routes from './routes/task-list-routes.mjs';
app.use('/', routes);

// Configure view engine
app.engine(
   'hbs',
   exphbs.engine({
      extname: 'hbs',
   })
);
app.set('view engine', 'hbs');

// Error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).render('error', { error: err });
});

export { app as taskList };
