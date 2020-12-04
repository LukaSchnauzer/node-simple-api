
import Lessons, {length, splice, push } from "../../sample_lessons.json";
import {getCourse} from './CoursesDao';

export function deleteLesson(id){
    var len = Lessons.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Lessons[i].lesson_id == id){
        Lessons.splice(i,1);
        i++;
        len = Lessons.length;
        found = true;
      }
    }
    return found;
  }
  
  export function updateLesson(id,params){
    var len = Lessons.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Lessons[i].lesson_id == id){
        //update
        if(params.name){
          Lessons[i].name = params.name;
        }
        if(params.previous_lessons){
          Lessons[i].previous_lessons = params.previous_lessons;
        }
        if(params.questions){
          Lessons[i].questions = params.questions;
        }
        if(params.minimum_score){
          Lessons[i].minimum_score = params.minimum_score;
        }
        found = true;
      }
    }
    return found;
  }
  
  export function getLesson(id){
    var len = Lessons.length;
    for(var i=0; i < len; i++ ){
        if(Lessons[i].lesson_id == id){
            return Lessons[i];
        }
    }
    return false;
  }
  
  export function createLesson(lesson){
    var len = Lessons.length
    for(var i=0; i < len; i++ ){
      if(Lessons[i].lesson_id == lesson.lesson_id){
        return false; //duplicate id
      }
    }
    Lessons.push(lesson);
    return true;
  }
  
  export function getAllLessons(){
    return Lessons;
  }

  export function getLessonsFromCourse(course_id){
    const lessonsInCourse = [];
    const course = getCourse(course_id);

    course.lessons.forEach(lesson_id => {
      lessonsInCourse.push(getLesson(lesson_id));
    });

    return lessonsInCourse;
  }
