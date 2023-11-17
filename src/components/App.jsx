import Questions from "./Questions";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import Loader from "./Loader";
import Error from "./Error";
import Welcome from "./Welcome";
import Form from "./Form";
import QuizResult from "./QuizResult";

import { QuizProvider, useQuiz } from "../contexts/QuizContext";

function App() {
  return (
    <div className="app">
      <QuizProvider>
        <Header />
        <MainContent>
          <Content />
        </MainContent>
        <Footer />
      </QuizProvider>
    </div>
  );
}

function Content() {
  const { status, isLoading } = useQuiz();

  return (
    <>
      {status === "start" && (
        <>
          <Welcome />
          <Form />
        </>
      )}
      {status !== "start" && isLoading && <Loader />}
      {status === "error" && (
        <Error message="Something went wrong during fetching the data certainly. Kindly go back to the settings" />
      )}
      {status === "ready" && <Questions />}
      {status === "quizResult" && <QuizResult />}
    </>
  );
}

export default App;
