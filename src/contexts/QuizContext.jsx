import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";


import { callbackReducer, takenQuizResult } from "./CallbackReducer";

// CREATE A CONTEXT
const quizContext = createContext();

const API_BASIC_URL = "https://opentdb.com/api.php";

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

function QuizProvider({ children }) {
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
  ] = useReducer(callbackReducer, initialQuiz);

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

          if (data.results.length === 0) return dispatch({ type: "error" });

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
    <quizContext.Provider
      value={{
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
        isLoading,
        numberQuestions,
        takenQuizResult,
        onDispatch: dispatch,
      }}
    >
      {children}
    </quizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(quizContext);
  if (context === undefined)
    throw new Error("You have certainly used useQuiz out of the QuizProvider");

  return context;
}

export { QuizProvider, useQuiz };
