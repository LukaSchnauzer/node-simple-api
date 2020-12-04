
import Questions, {length, splice, push } from "../../sample_questions.json";

export function deleteQuestion(id){
    var len = Questions.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Questions[i].question_id == id){
        Questions.splice(i,1);
        i++;
        len = Questions.length;
        found = true;
      }
    }
    return found;
  }
  
  export function updateQuestion(id,params){
    var len = Questions.length;
    var found = false;
    for(var i=0; i < len; i++ ){
      if(Questions[i].question_id == id){
        //update
        if(params.question){
          Questions[i].question = params.question;
        }
        if(params.score){
          Questions[i].score = params.score;
        }
        if(params.allCorrectRequired){
          Questions[i].allCorrectRequired = params.allCorrectRequired;
        }
        if(params.aswers){
          Questions[i].aswers = params.aswers;
        }
        if(params.correct_answers){
          Questions[i].correct_answers = params.correct_answers;
        }
        found = true;
      }
    }
    return found;
  }
  
  export function getQuestion(id){
    var len = Questions.length;
    for(var i=0; i < len; i++ ){
        if(Questions[i].question_id == id){
            return Questions[i];
        }
    }
    return false;
  }
  
  export function createQuestion(question){
    var len = Questions.length;
    for(var i=0; i < len; i++ ){
      if(Questions[i].question_id == question.question_id){
        return false; //duplicate id
      }
    }
    Questions.push(question);
    return true;
  }
  
  export function getAllQuestions(){
    return Questions;
  }
