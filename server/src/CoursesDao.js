
import Courses, {length, splice, push } from "../../sample_courses.json";
import {getAllLessons, getLesson, deleteLesson, updateLesson, createLesson} from '../src/LessonsDao';

export function deleteCourse(id){
    var len = Courses.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Courses[i].course_id == id){
        Courses.splice(i,1);
        i++;
        len = Courses.length;
        found = true;
      }
    }
    return found;
  }
  
  export function updateCourse(id,params){
    var len = Courses.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Courses[i].course_id == id){
        if(params.name){
          Courses[i].name = params.name;
        }
        if(params.previous_courses){
          Courses[i].previous_courses = params.previous_courses;
        }
        if(params.lessons){
          Courses[i].lessons = params.lessons;
        }
        found = true;
      }
    }
    return found;
  }
  
  export function getCourse(id){
    var len = Courses.length;
    for(var i=0; i < len; i++ ){
        if(Courses[i].course_id == id){
            return Courses[i];
        }
    }
    return false;
  }
  
  export function createCourse(course){
    var len = Courses.length;
    for(var i=0; i < len; i++ ){
      if(Courses[i].course_id == course.course_id){
        return false; //duplicate id
      }
    }
    Courses.push(course);
    return true;
  }
  
  export function getAllCourses(){
    return Courses;
  }
