import Users, {length, splice, push } from "../../sample_users.json";

export function isUser(id){
    var len = Users.length;
    for(var i=0; i < len; i++ ){
        if(Users[i].user_id == id){
            return true;
        }
    }
    return false;
}

export function isProfessor(id){
    var len = Users.length;
    for(var i=0; i < len; i++ ){
        if(Users[i].user_id == id){
            return Users[i].role == "P";
        }
    }
    return false;
}

export function getUserApprovedLessons(id){
    var len = Users.length;
    for(var i=0; i < len; i++ ){
        if(Users[i].user_id == id){
            return Users[i].approved_lessons;
        }
    }
    return false;
}

export function getUser(id){
    var len = Users.length;
    for(var i=0; i < len; i++ ){
        if(Users[i].user_id == id){
            return Users[i];
        }
    }
    return false;
  }

export function addAprovedLesson(user_id, lesson_id){
    const user = getUser(user_id);
    if(user){
        if(user.approved_lessons){
            user.approved_lessons.push(lesson_id);
        }else{
            user.approved_lessons = [lesson_id];
        }
    }
}
