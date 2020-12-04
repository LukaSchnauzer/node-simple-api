import {Router} from 'express';
import { body, validationResult } from 'express-validator';
import {getAllCourses, getCourse, deleteCourse, updateCourse, createCourse} from '../src/CoursesDao';
import {isArrayofIDs,extract, expandCourse, getDetailedCourses} from '../src/Utils';
import {isUser, isProfessor, getUserApprovedLessons} from '../src/UsersDao';
const _ = require('underscore');

var router = Router();

const validCreateCourseJson = [
  body('course_id').isInt(),
  body('name').isString(),
  body('previous_courses').custom(isArrayofIDs),
  body('lessons').custom(isArrayofIDs),
  body('user_session_id').isInt()
]

const validUpdateCourseJson = [
  body('name').optional().isString(),
  body('previous_courses').optional().custom(isArrayofIDs),
  body('lessons').optional().custom(isArrayofIDs),
  body('user_session_id').isInt()
]

const validUserDataCourseJson = [
  body('user_session_id').isInt()
]

router.get('/all', (req, res, next) => {
  res.status(200).json(getAllCourses());
});

router.post('/all/detailed', validUserDataCourseJson, (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const user_id = req.body.user_session_id;
  if(isUser(user_id)){
    const courses = getAllCourses();
    const detailedCourses = getDetailedCourses(courses,getUserApprovedLessons(user_id));
    res.status(200).json(detailedCourses);
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  const course = getCourse(id);
  if(course){
    try {
      const responseJson = expandCourse(course.course_id);
      res.status(200).json(responseJson);
    } catch (error) {
      res.status(400).json({"errors":error.message});
    }
    
  }else{
    res.status(404).json({'errors':'Course Not Found'});
  }
});

router.post('/',validCreateCourseJson, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const user_id = req.body.user_session_id;
  // Request Body is correct
  if(isUser(user_id) && isProfessor(user_id)){
    const newCourse = extract(req.body , 'course_id','name','previous_courses','lessons');
    if(createCourse(newCourse)){
      //Course created
      res.status(201).json(newCourse);
    }else{
      res.status(400).json({'errors':'ID Taken'});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.put('/:id',validUpdateCourseJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(updateCourse(id,req.body)){
      res.status(200).json(getAllCourses());
    }else{
      res.status(404).json({'errors':'Course Not Found'});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.delete('/:id',validUserDataCourseJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(deleteCourse(id)){
      res.status(200).json(getAllCourses());
    }else{
      res.status(404).json({'errors':'Course Not Found'});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});


export default router;
