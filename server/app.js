import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import courseRouter from './routes/Courses';
import lessonRouter from './routes/Lessons';
import questionRouter from './routes/Questions';

// Middlewares
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/questions', questionRouter);

export default app;