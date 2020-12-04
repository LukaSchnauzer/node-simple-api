# NodeJS Simple API
This simple API REST was made using **NodeJS 12.18.4** and **Express**  due to its simplicity for server creation and request validation options.

## Instalation
To install all the Node dependencies requiered, run the following comand in the project folder:

    npm install

## Using the API
To start the API, run the command:

    npm run start

This will  start the server locally on the URL **http://localhost:ENV_PORT/** 
Most of the time ENV_PORT will be **3000** which is also teh default value for the port.
This is the direction to where all the requests are sent.

# Mock Data Base
This project has no database connection, this is simulated with the JSON files:

 1. sample_courses.json
 2. sample_lesons.json
 3. sample_question.json
 4. sample_users.json

When the server stops, all data will be reverted to be the same as in the files.
This mock can't handle data integrity, so most of the time this is handled programmatically

# Users
With the current mock there is only 2 users. User 1 has role "P" for Professor and User 2 has role "S" for Student.
Only professor can alter the data (create, update, or delete).

## Endpoints

 - **GET ~ /api/courses/int:course_id**
 - **GET ~ /api/courses/all**
 -  **POST ~ /api/courses/**
 - **POST ~ /api/courses/all/detailed**
 - **PUT ~ /api/courses/int:course_id**
 - **DELETE ~ /api/courses/int:course_id**
 - **GET ~ /api/lessons/int:lesson_id**
 - **GET ~ /api/lessons/all**
 - **POST ~ /api/lessons/**
 - **POST ~ /api/lessons/all/detailed/int:course_id**
 - **PUT ~ /api/lessons/int:lesson_id**
 - **DELETE ~ /api/lessons/int:lesson_id**
 - **GET ~ /api/questions/int:question_id**
 - **GET ~ /api/questions/all**
 - **POST ~ /api/questions/**
 - **PUT ~ /api/questions/int:question_id**
 - **DELETE ~ /api/questions/int:question_id**
 -  -**POST ~ /api/lessons/answer/int:lesson_id**


This API always answers with a **JSON**, either with the data requested or with an *errors* message.
The enpoints exposed are as following:

 - **GET ~ /api/courses/<int:course_id>**
It returns the detailed information of the course with ID course_id. 
**Example:**
Request: GET http://localhost:3000/api/courses/1
Response:
		
	    {
		  "name": "Course 1",
		  "previous_courses": null,
		  "lessons": [
		    {
		      "lesson_id": 1,
		      "name": "Lesson 1",
		      "previous_lessons": null,
		      "minimum_score": 6,
		      "questions": [
			{
			  "question_id": 1,
			  "question": "Question 1?",
			  "score": 4,
			  "allCorrectRequired": true,
			  "aswers": [
			    "True",
			    "False"
			  ],
			  "correct_answers": [
			    "True"
			  ]
			},
			{
			  "question_id": 2,
			  "question": "Question 2?",
			  "score": 2,
			  "allCorrectRequired": true,
			  "aswers": [
			    "Option a",
			    "Option b",
			    "Option c"
			  ],
			  "correct_answers": [
			    "Option b"
			  ]
			}
		      ]
		    },
		    {
		      "lesson_id": 2,
		      "name": "Lesson 2",
		      "previous_lessons": [
			1
		      ],
		      "minimum_score": 8,
		      "questions": [
			{
			  "question_id": 3,
			  "question": "Question 3?",
			  "score": 4,
			  "allCorrectRequired": false,
			  "aswers": [
			    "Option a",
			    "Option b",
			    "Option c"
			  ],
			  "correct_answers": [
			    "Option b",
			    "Option c"
			  ]
			},
			{
			  "question_id": 4,
			  "question": "Question 4?",
			  "score": 4,
			  "allCorrectRequired": true,
			  "aswers": [
			    "Option a",
			    "Option b",
			    "Option c"
			  ],
			  "correct_answers": [
			    "Option b",
			    "Option c"
			  ]
			}
		      ]
		    }
		  ]
		}

Here's  the response when course_id isn's found:
Request: GET http://localhost:3000/api/courses/5
Response:

    {"errors":  "Course Not Found"}

 - **GET ~ /api/courses/all**
Returns an array of all the courses in simple form.

**Example:**
Request: GET http://localhost:3000/api/courses/all
Response:

    [{"course_id":1,"name":"Course 1","previous_courses":null,"lessons":  [1,2]},{...}]

 - **POST ~ /api/courses/**
Creates a course, the data for the new course is given on the body of the request as a JSON
**Example:**
Request:
 POST http://localhost:3000/api/courses/
Headers:  Content-Type = application/json
Body :

	    {
		    "course_id"  :  5,
		    "name":  "Course 5",
		    "previous_courses":  null,
		    "lessons":  [1,2,3],
		    "user_session_id"  :  1
	    }
The parameter user_session_id is the user_id of the current session.
Response: The same JSON if the operation was succesful, otherwise the response is a JSON with *errors*, for example:

    {"errors":  "ID Taken"}

If the JSON in the body of the request is built incorrectly (i.e. a necessary field isn't set, or it has a wrong data type), it will be reported in a JSON with *errors* and the operation will be canceled:

    { "errors":  [{	"msg":  "Invalid value","param":"name","location":"body"}]}

this is true for every JSON required on the request body.

 - **POST ~ /api/courses/all/detailed**
Returns a list of every available Course, and whether it is approved by the current user, base on the its lessons. Also whether it can be accessed by the current users based on the previous courses required.
**Example:**
Request:
 POST http://localhost:3000/api/courses/all/detailed
Headers:  Content-Type = application/json
Body :

	    {
		    "user_session_id"  :  2
	    }
Only user_session_id is required.
Response:

    [{
        "name": "Course 1",
        "previous_courses": null,
        "lessons": [...],
        "approved": false, 
        "userCanAccess": true
    },....]


 - **PUT ~ /api/courses/<int:course_id>**
Updates the course with the ID course_id. This operation recieves the new data in the body of the request.
**Example:**
Request:
 PUT http://localhost:3000/api/courses/5
Headers:  Content-Type = application/json
Body :

	    {
		    "name":  "New Name of Course 5",
		    "user_session_id"  :  1
	    }
The parameter user_session_id is the only non optional data for this request.

 - **DELETE ~ /api/courses/<int:course_id>**
Deletes the course with the ID course_id. This operation only receives the user-session-id from the JSON in the request body.
**Example:**
DELETE http://localhost:3000/api/courses/5
Headers:  Content-Type = application/json
Body :

	    {
		    "user_session_id"  :  1
	    }

 - **GET ~ /api/lessons/int:lesson_id**
It returns the detailed information of the lesson with ID lesson_id.
**Example:**
Request: GET http://localhost:3000/api/lessons/1
Response:

 

	    {
	  "lesson_id": 1,
	  "name": "Lesson 1",
	  "previous_lessons": null,
	  "minimum_score": 6,
	  "questions": [
	    {
	      "question_id": 1,
	      "question": "Question 1?",
	      "score": 4,
	      "allCorrectRequired": true,
	      "aswers": [
		"True",
		"False"
	      ],
	      "correct_answers": [
		"True"
	      ]
	    },
	    {
	      "question_id": 2,
	      "question": "Question 2?",
	      "score": 2,
	      "allCorrectRequired": true,
	      "aswers": [
		"Option a",
		"Option b",
		"Option c"
	      ],
	      "correct_answers": [
		"Option b"
	      ]
	    }
	  ]
	}

Here’s the response when lesson_id isn’s found:
Request: GET http://localhost:3000/api/lessons/5
Response:

    {"errors":  "Lesson Not Found"}

 - **GET ~ /api/lessons/all**

Returns an array of all the lessons in simple form.
**Example:**
Request: GET http://localhost:3000/api/lessons/all
Response:

    [{"lesson_id": 1,"name": "Lesson 1","previous_lessons": null,"questions":[1,2],"minimum_score": 6},{...}]

 - **POST ~ /api/lessons/**

Creates a lesson, the data for the new leson is given on the body of the request as a JSON
**Example:**
Request:
POST http://localhost:3000/api/lessons/
Headers: Content-Type = application/json
Body :

     {
        "lesson_id" : 90,    
        "name" : "This is Lesson 90",
        "previous_lessons" : null,
        "questions" : [1],
        "minimum_score": 6,
        "user_session_id" : 1
    }

The parameter user_session_id is the user_id of the current session.

Response: The same JSON if the operation was succesful, otherwise the response is a JSON with errors, for example:

    {"errors":  "ID Taken"}

 - **POST ~ /api/lessons/all/detailed/int:course_id**

Returns a list of every available lesson int the course with ID course_id, and whether it is approved by the current user, base on the its approved lessons.
**Example:**
Request:
POST http://localhost:3000/api/lessons/all/detailed/1
Headers: Content-Type = application/json
Body :

     {
         "user_session_id"  :  2
     }

Only user_session_id is required.
Response:

    [{
        {
            "lesson_id": 1,
            "name": "Lesson 1",
            "previous_lessons": null,
            "minimum_score": 6,
            "questions": [...],
            "aproved": false,
            "userCanAccess": true
        }
    },....]

 - **PUT ~ /api/lessons/int:lesson_id**

Updates the lesson with the ID lesson_id. This operation recieves the new data in the body of the request.
**Example:**
Request:
PUT http://localhost:3000/api/lessons/5
Headers: Content-Type = application/json
Body :

     {
         "name":  "New Name of Lesson 5",
         "user_session_id"  :  1
     }

The parameter user_session_id is the only non optional data for this request.

 - **DELETE ~ /api/lessons/int:lesson_id**

Deletes the lesson with the ID lesson_id. This operation only receives the user-session-id from the JSON in the request body.
**Example:**
DELETE http://localhost:3000/api/lessons/5
Headers: Content-Type = application/json
Body :

     {
         "user_session_id"  :  1
     }

 - **GET ~ /api/questions/int:question_id**
It returns the detailed information of the question with ID question_id.
Example:
Request: GET http://localhost:3000/api/questions/1
Response:

	    {   "question_id":  1,
	        "question":  "Question 1?",
	        "score":  4,
	        "allCorrectRequired":  true,
	        "aswers":  ["True","False"],
	        "correct_answers":  ["True"]
	    }

Here’s the response when question_id isn’s found:
Request: GET http://localhost:3000/api/questions/9
Response:

    {"errors":  "Question Not Found"}

 - **GET ~ /api/questions/all**

Returns an array of all the questions in simple form.
**Example:**
Request: GET http://localhost:3000/api/questions/all
Response:

    [{"question_id": 1,"question": "Question 1?","score": 4,"allCorrectRequired": true,"aswers": [ "True", "False"],"correct_answers": ["True"]},{...}]

Here the value *allCorrectRequired* is used to diferenciate between the different types of questions available:

 1. Boolean question: is just a multiple choice question with only two possible answers and only one correct
 2. Multiple choice where only one answer is correct: can be achieved with *allCorrectRequired* set to True, and just entering a single *correct_answer*. So it's necesary to answer every correct answer but there's only one.
 3.  Multiple choice where more than one answer is correct: just setting *allCorrectRequired* to False.
 4. Multiple choice where more than one answer is correct and all of them must be answered correctly: setting *allCorrectRequired* to True

 - **POST ~ /api/questions/**

Creates a question, the data for the new question is given on the body of the request as a JSON
**Example:**
Request:
POST http://localhost:3000/api/questions/
Headers: Content-Type = application/json
Body :

     {
            "question_id": 9,
            "question" : "9?",
            "score" : 4,
            "allCorrectRequired" : true,
            "aswers" : ["1", "2","3"],
            "correct_answers" : ["2","3"],
            "user_session_id" : 1
    }

The parameter user_session_id is the user_id of the current session.

Response: The same JSON if the operation was succesful, otherwise the response is a JSON with errors, for example:

    {"errors":  "ID Taken"}

 - **PUT ~ /api/questions/int:question_id**

Updates the question with the ID question_id. This operation recieves the new data in the body of the request.
**Example:**
Request:
PUT http://localhost:3000/api/questions/5
Headers: Content-Type = application/json
Body :

     {
         "question":  "New question",
         "user_session_id"  :  1
     }

The parameter user_session_id is the only non optional data for this request.

 - **DELETE ~ /api/questions/int:question_id**

Deletes the question with the ID question_id. This operation only receives the user-session-id from the JSON in the request body.
**Example:**
DELETE http://localhost:3000/api/questions/5
Headers: Content-Type = application/json
Body :

     {
         "user_session_id"  :  1
     }

 - **POST ~ /api/lessons/answer/int:lesson_id**
Used to send the answers to al the question in lesson with the ID lesson_id. The answers are sent in the request body as a json.
**Example:**
POST http://localhost:3000/api/lessons/answer/1
Headers: Content-Type = application/json
Body:

	    { "answers":  [ {"question_id":  1,"given_answer":  ["True"]},{	"question_id":  2,"given_answer":  ["Option b"]}], "user_session_id":  2}
Every question_id corresponding to the question in the lesson must be sent with their respective given_answer, wich is the answer chosen by the user.

Te response is either:

    {"result":  "Lesson Approved","score":  6}

Or

    {"result":  "Lesson Failed","score":  2}

The lesson is approved if the score is at least the lesson's *minimun_score*.
When the lesson it's approved it's automatically saved in the data of the user.
 



