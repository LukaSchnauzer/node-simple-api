import { isNull } from 'underscore';
import {getAllCourses, getCourse, deleteCourse, updateCourse, createCourse} from '../src/CoursesDao';
import {getAllLessons, getLesson, deleteLesson, updateLesson, createLesson} from '../src/LessonsDao';
import {getAllQuestions,getQuestion,deleteQuestion,updateQuestion, createQuestion} from '../src/QuestionsDao';
import {addAprovedLesson} from '../src/UsersDao';


export function isArrayofIDs(value) {
    if(value == null){
      return true;
    }
    if(Array.isArray(value)){
      return value.every(e =>{
        return Number.isInteger(e);
      });
    }else{
      return false;
    }
  }

  export function isAnswersList(value) {
    if(value == null){
      return false;
    }
    if(Array.isArray(value)){
      return value.every(e =>{
        return isAnswer(e);
      });
    }else{
      return false;
    }
  }

  function isAnswer(value){
    if(value.question_id && Number.isInteger(value.question_id)){
      if(value.given_answer && Array.isArray(value.given_answer) ){
        return value.given_answer.every( e =>{
          return typeof e == 'string';
        });
      }
    }

    return false;
  }

  export function isArrayofStrings(value) {
    if(value == null){
      return true;
    }
    if(Array.isArray(value)){
      return value.every(e =>{
        return typeof e == 'string';
      });
    }else{
      return false;
    }
  }
  
export function expandCourse(course_id){
    const course = getCourse(course_id);
    if(course){
        const newObject = Object.assign({});
        newObject['name'] = course['name'];
        newObject['previous_courses'] = course['previous_courses'];
        newObject['lessons'] = [];
        expandLessonsList(newObject,course['lessons']);
        return newObject;
    }else{
        throw 'Course not Found';
    }
  }

function expandLessonsList(course,lessons){
    const len = lessons.length;
    for(var i=0; i < len; i++ ){
        var lesson_id = lessons[i];
        try {
            course['lessons'].push(expandLesson(lesson_id));
        } catch (error) {
            course['lessons'].push({'name':'Leson '+lesson_id+' Not Found'});   
        }
    }
  }

export function expandLesson(lesson_id){
    const lesson = getLesson(lesson_id);
    if(lesson){
        const newObject = Object.assign({});
        newObject['lesson_id'] = lesson['lesson_id'];
        newObject['name'] = lesson['name'];
        newObject['previous_lessons'] = lesson['previous_lessons'];
        newObject['minimum_score'] = lesson['minimum_score'];
        newObject['questions'] = [];
        expandQuestionsList(newObject, lesson['questions']);
        return newObject;
    }else{
      throw 'Lesson not Found';
    }
  }

function expandQuestionsList(lesson, questions){
    const len = questions.length;
    for(var i=0; i < len; i++ ){
        const question_id = questions[i];
        const question = getQuestion(question_id);
        if(question){
            lesson['questions'].push(question);
        }else{
            lesson['questions'].push({'question':'Question '+question_id+' Not Found'});
        }
    }
}

  
export function extract(obj, ...keys){
    const newObject = Object.assign({});
    Object.keys(obj).forEach((key) => {
       if(keys.includes(key)){
          newObject[key] = obj[key];
          delete obj[key];
       };
    });
    return newObject;
};

export function getDetailedCourses(courses,userApprovedLessons){
  const detailedCourses = [];
  courses.forEach(course => {
    const expandedCourse = expandCourse(course.course_id);
    expandedCourse.lessons = getDetailedLessons(expandedCourse.lessons,userApprovedLessons);
    expandedCourse['approved'] = getIfUserApprovedCourse(course,userApprovedLessons);
    expandedCourse['userCanAccess'] = getIfUserCanAccessCourse(course,userApprovedLessons);
    detailedCourses.push(expandedCourse);
  });
  return detailedCourses;
}

export function getDetailedLessons(lessons,userApprovedLessons){
  const detailedLessons = [];
  lessons.forEach(lesson => {
    const expandedLesson = expandLesson(lesson.lesson_id);
    expandedLesson['aproved'] = getIfUserApprovedLesson(lesson.lesson_id, userApprovedLessons);
    expandedLesson['userCanAccess'] = getIfUserCanAccessLesson(lesson.lesson_id, userApprovedLessons);
    detailedLessons.push(expandedLesson);
  });
  return detailedLessons;
}

function getIfUserApprovedLesson(lesson_id , userApprovedLessons){
  if(userApprovedLessons == null){
    //User hasn't approved any lesson
    return false;
  }else{
    return userApprovedLessons.includes(lesson_id);
  }
}

function getIfUserCanAccessLesson(lesson_id, userApprovedLessons){
  const lesson = getLesson(lesson_id);
  const previous_lessons = lesson[previous_lessons];
  if(previous_lessons == null){
    //No previous lesson required
    return true;
  }else{
    return previous_lessons.every(lesson_id =>{
      return userApprovedLessons.includes(lesson_id);
    });
  }
}

function getIfUserApprovedCourse(course, userApprovedLessons){
  return course.lessons.every(lesson_id =>{
    return getIfUserApprovedLesson(lesson_id, userApprovedLessons);
  });
}

function getIfUserCanAccessCourse(course, userApprovedLessons, user_id){
  if(course.previous_courses == null){
    return true;
  }else{
    return course.previous_courses.every(course_id =>{
      const previousCourse = getCourse(course_id);
      if(previousCourse){
        return getIfUserApprovedCourse(previousCourse,userApprovedLessons,user_id);
      }
      return false;
    });
  }
}

function getIfQuestionsCorrespondToLesson(lesson,answers){
  const question_ids = [];
  answers.forEach(answer => {
    question_ids.push(answer.question_id);
  });

  //Every question id in the lesson must be given in the answer
  return lesson.questions.every(question_id =>{
    return question_ids.includes(question_id);
  });
}

export function validateAnswer(lesson, answers,user_id){
  const result =  Object.assign({});
  if(getIfQuestionsCorrespondToLesson(lesson, answers)){
    return getResultAndScore(lesson, answers,user_id);
  }else{
    result['result'] = 'Lesson Failed';
    result['score'] = 0;
  }

  return result;
}

function getResultAndScore(lesson, answers,user_id){
  var currentScore = 0;
  var result;
  answers.forEach(answer => {
    currentScore += getScore(answer);
  });

  if(currentScore >= lesson.minimum_score){
    result = "Lesson Approved";
    addAprovedLesson(user_id,lesson.lesson_id);
  }else{
    result = "Lesson Failed"
  }

  return {'result' : result, 'score':currentScore};
}

function getScore(answer){
  const question = getQuestion(answer.question_id);
  
  if(question){
    const givenAnswer = answer.given_answer;
    const allCorrectRequiered = question.allCorrectRequired;
    const correct_answers = question.correct_answers;
    if(isCorrect(correct_answers,allCorrectRequiered,givenAnswer)){
      return question.score;
    }
  }

  return 0;
}

function isCorrect(correct_answers,allCorrectRequiered,givenAnswer){
  if(allCorrectRequiered){
    //Then every correct answer must be given
    return correct_answers.every(ca => {
      return givenAnswer.includes(ca);
    });
  }else{
    //else every given answer must be correct
    return givenAnswer.every(ga => {
      return correct_answers.includes(ga);
    });
  }
}