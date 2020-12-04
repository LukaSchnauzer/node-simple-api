import {Router} from 'express';
import { body, validationResult } from 'express-validator';
import {createQuestion, getAllQuestions, getQuestion, updateQuestion, deleteQuestion} from '../src/QuestionsDao';
import {isArrayofStrings,extract} from '../src/Utils';
import {isUser, isProfessor} from '../src/UsersDao';
const _ = require('underscore');

var router = Router();

const validCreateQuestionJson = [
  body('question_id').isInt(),
  body('question').isString(),
  body('score').isInt(),
  body('allCorrectRequired').isBoolean(),
  body('aswers').custom(isArrayofStrings),
  body('correct_answers').custom(isArrayofStrings),
  body('user_session_id').isInt()
]

const validUpdateQuestionJson = [
    body('question').optional().isString(),
    body('score').optional().isInt(),
    body('allCorrectRequired').optional().isBoolean(),
    body('aswers').optional().custom(isArrayofStrings),
    body('correct_answers').optional().custom(isArrayofStrings),
    body('user_session_id').isInt()
]

const validDeleteQuestionJson = [
  body('user_session_id').isInt()
]

router.get('/all', (req, res, next) => {
  res.status(200).json(getAllQuestions());
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  const question = getQuestion(id);
  if(question){
   res.status(200).json(question);
  }else{
    res.status(404).json({"errors" : "Question Not Found"});
  }
});

router.post('/',validCreateQuestionJson, (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  // Request Body is correct
  const newQuestion = extract(req.body , 'question_id','question','score','allCorrectRequired','aswers','correct_answers');
  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(createQuestion(newQuestion)){
      //Question created
      res.status(201).json(newQuestion);
    }else{
      res.status(400).json({"errors" : "ID Taken"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.put('/:id',validUpdateQuestionJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(updateQuestion(id,req.body)){
      res.status(200).json(getAllQuestions());
    }else{
      res.status(404).json({"errors" : "Question Not Found"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});

router.delete('/:id',validDeleteQuestionJson, (req,res) => {
  const {id} = req.params;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const user_id = req.body.user_session_id;
  if(isUser(user_id) && isProfessor(user_id)){
    if(deleteQuestion(id)){
      res.status(200).json(getAllQuestions());
    }else{
      res.status(404).json({"errors" : "Question Not Found"});
    }
  }else{
    res.status(400).json({'errors':'NOT ALLOWED'});
  }
  
});


export default router;
