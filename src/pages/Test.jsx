import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";;
import tests from "../data/tests.json";
import { useTimer } from "../hooks/useTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ProgressBar from "../components/ProgressBar";

const initialState = { current: 0, answers: {} };

function reducer(state, action) {
  switch (action.type) {
    case "select":
      return {
        ...state,
        answers: { ...state.answers, [state.current]: action.index },
      };
    case "next":
      return { ...state, current: state.current + 1 };
    case "prev":
      return { ...state, current: state.current - 1 };
    default:
      return state;
  }
}

function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useLocalStorage("history", []);
  const [state, dispatch] = useReducer(reducer, initialState);

  const test = tests.find((t) => t.id === Number(id));

  const finish = () => {
  if (!test) return;

  const score = test.questions.filter(
    (q, i) => state.answers[i] === q.correct
  ).length;

  setHistory([
    ...history,
    {
      id: Date.now(),
      testId: test.id,
      title: test.title,
      score,
      total: test.questions.length,
      date: new Date().toLocaleString("ka-GE"),
    },
  ]);

  navigate("/results", {
    state: { testId: test.id, answers: state.answers },
  });
};

  const timeLeft = useTimer(test ? test.timeLimit : 0, finish);

  if (!test) return <p>ტესტი ვერ მოიძებნა</p>;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const question = test.questions[state.current];
  const total = test.questions.length;
  const selected = state.answers[state.current];

  return (
    <div>
      <h2>{test.title}</h2>
      <p>დარჩენილი დრო: {minutes}:{seconds}</p>
      <p>
        კითხვა {state.current + 1} / {total}
      </p>
      <ProgressBar current={state.current} total={total} />
      <h3>{question.question}</h3>

      {question.options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="answer"
              checked={selected === index}
              onChange={() => dispatch({ type: "select", index })}
            />
            {option}
          </label>
        </div>
      ))}

 <div style={{ marginTop: 16 }}>
  <button
    onClick={() => dispatch({ type: "prev" })}
    disabled={state.current === 0}
  >
    უკან
  </button>

  {state.current < total - 1 ? (
    <button onClick={() => dispatch({ type: "next" })}>შემდეგი</button>
  ) : (
    <button onClick={finish}>დასრულება</button>
  )}
</div>
    </div>
  );
}

export default Test;