import { useState, useEffect } from "react";
import Input from "./Input";

const difficulties = ["Easy", "Medium", "Hard"];

function Form({ onDispatch }) {
  const [limit, setLimit] = useState(10);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState(null);
  const [quizType, setQuizType] = useState("");

  useEffect(
    function () {
      async function getCategories() {
        try {
          const res = await fetch("https://opentdb.com/api_category.php");
          if (!res.ok)
            return console.log(
              "Something went wrong while fetching the categories"
            );
          const data = await res.json();

          setCategories(data.trivia_categories);
        } catch {
          throw new Error("Something went wrong in category useEffect");
        }
      }

      getCategories();
    },
    []
  );

  function handleForm(e) {
    e.preventDefault();

    if(category === "" || difficulty === "" || quizType === "") return;

    onDispatch({
      type: "quizSet",
      payload: { category, difficulty, limit, quizType },
    });
  }

  return (
    <form onSubmit={(e) => handleForm(e)}>
      <h2>Prepare your test by filling the form</h2>
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select a category</option>
        {categories &&
          categories.map((value) => (
            <option value={value.id} key={value.id}>
              {value.name}
            </option>
          ))}
      </select>

      <Input limit={limit} onSetLimit={setLimit} />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Select Difficulty</option>
        {difficulties.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>

      <select value={quizType} onChange={(e) => setQuizType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="multiple">Multiple choice</option>
        <option value="boolean">True / False</option>
      </select>

      <div>
        <button className="btn btn-submit">Start Quiz</button>
      </div>
    </form>
  );
}

export default Form;