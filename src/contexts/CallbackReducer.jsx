// HTML DEFAULT DECODING LIBRARY
import he from "he";

/** This function permits to return mininum second allowed for a user
 ** to answer each question according to its difficulty */
function setTimer(difficulty) {
    if (difficulty === "easy") return 15;
    if (difficulty === "medium") return 25;
    if (difficulty === "hard") return 30;
}

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


// This variable stocks questions with their correct answer and chosen answer
let takenQuizResult = [];

/**
 * This function catches all the dispacth actions
 * @param {*} state
 * @param {*} action | start | quizSet | error | dataReady | newAnswer | next | result | tick | showResult |
 *
 * @returns state with all its updated contents
 */
function callbackReducer(state, action) {
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
        const seconds = setTimer(state.difficulty) * state.questions.length;
  
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
        // Return quiz Result Array null if time is up
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
        return { ...state, result: "hide" };
      default:
        throw new Error("Something went wrong");
    }
  }

export {callbackReducer, takenQuizResult};