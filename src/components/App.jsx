import { useEffect } from "react";
import { useState } from "react";
import { useReducer } from "react";

import MultipleChoice from "./MultipleChoice";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import Loader from "./Loader";
import Error from "./Error";
import Welcome from "./Welcome";
import Form from "./Form";
import QuizResult from "./QuizResult";
import BooleanChoice from "./BooleanChoice";

const API_BASIC_URL = "https://opentdb.com/api.php";

function setTimer(difficulty, type) {
  if (difficulty === "easy" && type === "boolean") return 15;
  if (difficulty === "medium" && type === "boolean") return 20;
  if (difficulty === "hard" && type === "boolean") return 25;
  if (difficulty === "easy" && type === "multiple") return 20;
  if (difficulty === "medium" && type === "multiple") return 30;
  if (difficulty === "hard" && type === "multiple") return 35;
}

const initialQuiz = {
  questions: [],
  category: "",
  limit: 10,
  difficulty: "",
  quizType: "",
  status: "start",
  index: 0,
  answer: null,
  correct: null,
  score: 0,
  secondsNecessary: 0,
  result: null,
};

let takenQuizResult = [];

function getAnswers(incorrectAnswers, correctAnswer) {
  let answers = [...incorrectAnswers];
  const pos = Math.floor(Math.random() * incorrectAnswers.length + 1);
  answers.splice(Number(pos), 0, correctAnswer);
  return answers;
}

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        questions: [],
        category: "",
        limit: 10,
        difficulty: "",
        quizType: "",
        status: "start",
        index: 0,
        answer: null,
        correct: null,
        score: 0,
        secondsNecessary: 0,
        result: null,
      };
    case "quizSet":
      return {
        ...state,
        category: action.payload.category,
        limit: action.payload.limit,
        difficulty: action.payload.difficulty.toLowerCase(),
        quizType: action.payload.quizType,
        status: "active",
      };
    case "error":
      return { ...state, status: "error" };
    case "dataReady":
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

      const seconds =
        setTimer(state.difficulty, state.quizType) * state.questions.length;

      return {
        ...state,
        secondsNecessary: seconds,
        status: "ready",
        result: null,
      };
    case "newAnwer":
      state.correct = state.questions[state.index].correct_answer;
      const mark =
        state.questions[state.index].correct_answer === action.payload
          ? true
          : false;

      takenQuizResult[state.index] = {
        question: state.questions[state.index].question,
        correctAnswer: state.questions[state.index].correct_answer,
        answer: action.payload,
      };

      return {
        ...state,
        answer: action.payload,
        score: mark ? state.score + 10 : state.score,
        status: "nextQuestion",
      };
    case "next":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        correct: null,
        status: "ready",
      };
    case "result":
      return { ...state, status: "quizResult", quizType: "", category: "" };
    case "tick":
      if (state.secondsNecessary === 0 && takenQuizResult.length === 0) {
        takenQuizResult = [];
      }

      return {
        ...state,
        secondsNecessary: state.secondsNecessary - 1,
        status: state.secondsNecessary === 0 ? "quizResult" : state.status,
        quizType: state.secondsNecessary === 0 ? "" : state.quizType,
        category: state.secondsNecessary === 0 ? "" : state.category,
      };
    case "showResult":
      return { ...state, result: "show" };
    default:
      throw new Error("Something went wrong");
  }
}

function App() {
  const [
    {
      questions,
      category,
      limit,
      difficulty,
      quizType,
      status,
      index,
      answer,
      correct,
      score,
      secondsNecessary,
      result,
    },
    dispatch,
  ] = useReducer(reducer, initialQuiz);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function getQuestions() {
        try {
          if (category === "") return;

          setIsLoading(true);
          const res = await fetch(
            `${API_BASIC_URL}?amount=${limit}&category=${category}&difficulty=${difficulty}&type=${quizType}`
          );
          if (!res.ok) return dispatch({ type: "error" });
          const data = await res.json();

          dispatch({ type: "dataReady", payload: data.results });
          console.log(data.results);
        } catch {
          throw new Error("Something went wrong in the qestions useEffect");
        } finally {
          setIsLoading(false);
        }
      }

      getQuestions();
    },
    [limit, category, difficulty, quizType]
  );

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
        {status === "error" && <Error />}
        {quizType === "multiple" && (
          <MultipleChoice
            questions={questions}
            index={index}
            numberQuestions={numberQuestions}
            onDispatch={dispatch}
            answer={answer}
            status={status}
            correct={correct}
            score={score}
            seconds={secondsNecessary}
          />
        )}
        {quizType === "boolean" && (
          <BooleanChoice
            questions={questions}
            index={index}
            numberQuestions={numberQuestions}
            onDispatch={dispatch}
            answer={answer}
            status={status}
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
