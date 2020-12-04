import {Router} from 'express';
import { body, validationResult } from 'express-validator';
import {getAllLessons, getLesson, deleteLesson, updateLesson, createLesson, getLessonsFromCourse} from '../src/LessonsDao';
import {isArrayofIDs,extract, expandLesson, getDetailedLessons, isAnswersList, validateAnswer} from '../src/Utils';
import {isUser, isProfessor, getUserApprovedLessons} from '../src/UsersDao';
const _ = require('underscore');

var router = Router();

const validCreateLessonJson = [
  body('lesson_id').isInt(),
  body('name').isString(),
  body('previous_lessons').custom(isArrayofIDs),
  body('questions').custom(isArrayofIDs),
  body('minimum_score').isInt(),
  body('user_session_id').isInt()
]

const validUpdateLessonJson = [
  body('name').optional().isString(),
  body('previous_lessons').optional().custom(isArrayofIDs),
  body('questions').optional().custom(isArrayofIDs),
  body('minimum_score').optional().isInt(),
  body('user_session_id').isInt()
]

const validUserDataLessonJson = [
  body('user_session_id').isInt()
]

const validAnswersJson = [
  body('answers').custom(isAnswersList),
  body('user_session_id').isInt()
]

router.get('/all', (req, res, next) => {
  res.status(200).json(getAllLessons());
});


router.post('/all/detailed/:course_id', validUserDataLessonJson, (req, res, next) => {
  const {course_id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const user_id = req.body.user_session_id;
  if(isUser(user_id)){
    const lessons = getLessonsFromCourse(course_id);
    if(lessons){
      const detailedLessons = getDetailedLessons(lessons,getUserApprovedLessons(user_id));
      res.status(200).json(detailedLessons);
    }else{
      res.status(404).json({"errors" : "Course Not Found"});
    }
    
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  const lesson = getLesson(id);
  if(lesson){
    try {
      const responseJson = expandLesson(lesson.lesson_id);
      res.status(200).json(responseJson);
    } catch (error) {
      res.status(400).json({"errors":error.message});
    }
    
  }else{
    res.status(404).json({"errors" : "Lesson Not Found"});
  }
});

router.post('/',validCreateLessonJson, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  // Request Body is correct
  const newLesson = extract(req.body , 'lesson_id','name','previous_lessons','questions','minimum_score');
  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(createLesson(newLesson)){
      //Lesson created
      res.status(201).json(newLesson);
    }else{
      res.status(400).json({"errors" : "ID Taken"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.put('/:id',validUpdateLessonJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(updateLesson(id,req.body)){
      res.status(200).json(getAllLessons());
    }else{
      res.status(404).json({"errors" : "Lesson Not Found"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.delete('/:id',validUserDataLessonJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(deleteLesson(id)){
      res.status(200).json(getAllLessons());
    }else{
      res.status(404).json({"errors" : "Lesson Not Found"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.post('/answer/:lesson_id', validAnswersJson, (req,res) => {
  const {lesson_id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id)){
    const lesson = getLesson(lesson_id);
    if(lesson){
      const result = validateAnswer(lesson, req.body.answers, user_id);
      res.status(200).json(result);
    }else{
      res.status(404).json({"errors" : "Lesson Not Found"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
});


export default router;
