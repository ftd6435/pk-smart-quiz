import { useEffect } from "react";
import { useState } from "react";
import { useReducer } from "react";

import Questions from "./Questions";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import Loader from "./Loader";
import Error from "./Error";
import Welcome from "./Welcome";
import Form from "./Form";
import QuizResult from "./QuizResult";

import he from 'he';

const API_BASIC_URL = "https://opentdb.com/api.php";

/** This function permits to return mininum second allowed for a user 
 ** to answer each question according to its difficulty */

function setTimer(difficulty) {
  if (difficulty === "easy") return 15;
  if (difficulty === "medium") return 25;
  if (difficulty === "hard") return 30;
}

// Initial quiz set
const initialQuiz = {
  questions: [],
  category: "",
  limit: 10,
  difficulty: "",
  quizType: "",
  status: "start",
  nextQuestion: null,
  index: 0,
  answer: null,
  correct: null,
  score: 0,
  secondsNecessary: 0,
  result: null,
};

// This variable stocks questions with their correct answer and chosen answer 
let takenQuizResult = [];

/**
 * This function get two params and returns an array after joining them
 * @param {*} incorrectAnswers 
 * @param {*} correctAnswer 
 * @returns array
 */

function getAnswers(incorrectAnswers, correctAnswer) {
  let answers = [...incorrectAnswers];
  const pos = Math.floor(Math.random() * incorrectAnswers.length + 1);
  answers.splice(Number(pos), 0, correctAnswer);
  return answers;
}

/**
 * This function catches all the dispacth actions
 * @param {*} state 
 * @param {*} action | start | quizSet | error | dataReady | newAnswer | next | result | tick | showResult |
 * 
 * @returns state with all its updated contents 
 */

function reducer(state, action) {
  switch (action.type) {
    case "start": 
      // return all the initial state values
      takenQuizResult = [];
      return {
        ...state,
        questions: [],
        category: "",
        limit: 10,
        difficulty: "",
        status: "start",
        nextQuestion: null,
        index: 0,
        answer: null,
        correct: null,
        score: 0,
        secondsNecessary: 0,
        result: null,
      };

    // Quiz setting action
    case "quizSet":
      // Return state after setting the quiz. In other words, after filling the form
      return {
        ...state,
        category: action.payload.category,
        limit: action.payload.limit,
        difficulty: action.payload.difficulty.toLowerCase(),
        status: "active",
      };
    case "error":
      // Return state with status error anytime an error occurs
      return { ...state, status: "error" };

    // Data fetched successfully action
    case "dataReady":

      /**
       * In the fetch result 
       * The correct answer is out of the answer choices array
       * Here we get all the answers in the same array through the function getAnswers
       * SEE FUNC ABOVE
       */

      state.questions = action.payload.map((question) =>
        question.type === "multiple" || question.type === "boolean"
          ? {
              ...question,
              answers: getAnswers(
                question.incorrect_answers,
                question.correct_answer
              ),
            }
          : question
      );

      // Set timer according to the difficulty chosen SEE FUNC ABOVE 
      const seconds =
        setTimer(state.difficulty) * state.questions.length;

      // Return state after fetching the questions from the API 
      return {
        ...state,
        secondsNecessary: seconds,
        status: "ready",
        result: null,
      };

    // Answer selection action
    case "newAnwer":
      // Retrieve the correct answer
      state.correct = state.questions[state.index].correct_answer;
      
      // Return true if the chosen answer is equal to the correct answer
      const mark =
        state.questions[state.index].correct_answer === action.payload
          ? true
          : false;

      /** Add the question, its correct answer and the chosen answer to the array "takenQuizResult" 
       ** array created ABOVE */
      takenQuizResult[state.index] = {
        question: he.decode(state.questions[state.index].question),
        correctAnswer: he.decode(state.questions[state.index].correct_answer),
        answer: he.decode(action.payload),
      };

      // Return state, grade the answer then set status to nextQuestion
      return {
        ...state,
        answer: action.payload,
        score: mark ? state.score + 10 : state.score,
        nextQuestion: "nextQuestion",
      };

    // Next button action
    case "next":
      // After pressing the next button, increment index to get the next question
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        correct: null,
        nextQuestion: null,
      };

      // Result button action
    case "result":
      /** After taking test and pressed on result button, set quizType and category to null 
       ** to avoid fetching new questions or displaying an unwanted component */
      return { ...state, status: "quizResult", category: "" };

      // Timer actions
    case "tick":
      // Return quiz Reqult Array null if time is up
      if (state.secondsNecessary === 0 && takenQuizResult.length === 0) {
        takenQuizResult = [];
      }

      // Return state by unincrementing the necessary seconds
      return {
        ...state,
        secondsNecessary: state.secondsNecessary - 1,
        status: state.secondsNecessary === 0 ? "quizResult" : state.status,
        category: state.secondsNecessary === 0 ? "" : state.category,
      };

    // Show result button action
    case "showResult":
      return { ...state, result: "show" };
    case "hideResult":
      return {...state, result: "hide"};
    default:
      throw new Error("Something went wrong");
  }
}

function App() {
  // useReducer hook with an extracted state
  const [
    {
      questions,
      category,
      limit,
      difficulty,
      status,
      nextQuestion,
      index,
      answer,
      correct,
      score,
      secondsNecessary,
      result,
    },
    dispatch,
  ] = useReducer(reducer, initialQuiz);

  // Loader useState hook
  const [isLoading, setIsLoading] = useState(false);

  // This useEffect hook fetchs the questions according to user chosen difficulty, type, category, and amount
  useEffect(
    function () {
      async function getQuestions() {
        try {
          // If category is empty then return null right away without fetching
          if (category === "") return;

          setIsLoading(true);

          const res = await fetch(
            `${API_BASIC_URL}?amount=${limit}&category=${category}&difficulty=${difficulty}`
          );
          if (!res.ok) return dispatch({ type: "error" });
          const data = await res.json();

          if(data.results.length === 0) return dispatch({type: "error"});

          dispatch({ type: "dataReady", payload: data.results });
          // console.log(data.results);
        } catch {
          throw new Error("Something went wrong in the qestions useEffect");
        } finally {
          setIsLoading(false);
        }
      }

      getQuestions();
    },
    [limit, category, difficulty]
  );

  // Get the number of questions if it is not empty
  const numberQuestions = questions && questions.length;

  return (
    <div className="app">
      <Header />
      <MainContent>
        {status === "start" && (
          <>
            <Welcome />
            <Form onDispatch={dispatch} />
          </>
        )}
        {status !== "start" && isLoading && <Loader />}
        {status === "error" && <Error onDispatch={dispatch} message="Something went wrong during fetching the data certainly. Kindly go back to the settings" />}
        {status === "ready" && (
          <Questions
            questions={questions}
            index={index}
            numberQuestions={numberQuestions}
            onDispatch={dispatch}
            answer={answer}
            nextQuestion={nextQuestion}
            correct={correct}
            score={score}
            seconds={secondsNecessary}
          />
        )}
        {status === "quizResult" && (
          <QuizResult
            score={score}
            numberQuestions={numberQuestions}
            takenQuizResult={takenQuizResult}
            onDispatch={dispatch}
            showResult={result}
          />
        )}
      </MainContent>
      <Footer />
    </div>
  );
}

export default App;
