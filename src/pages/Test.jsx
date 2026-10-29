import { useReducer } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import tests from "../data/tests.json";
import { useTimer } from "../hooks/useTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();
  const [history, setHistory] = useLocalStorage("history", []);
  const [state, dispatch] = useReducer(reducer, initialState);

  const test = tests.find((t) => t.id === Number(id));

  const finish = () => {
    if (!test) return;

    const score = test.questions.filter(
      (q, i) => state.answers[i] === q.correct,
    ).length;

    if (user) {
      setHistory([
        ...history,
        {
          id: Date.now(),
          userId: user.id,
          testId: test.id,
          title: test.title,
          score,
          total: test.questions.length,
          date: new Date().toLocaleString("ka-GE"),
        },
      ]);
    }

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
      {!user && (
        <p className="notice">
          ისტორიის სანახავად საჭიროა <Link to="/register">რეგისტრაცია</Link> ან{" "}
          <Link to="/login">ავტორიზაცია</Link>. ამ ტესტის შედეგი არ შეინახება.
        </p>
      )}
      <div className="test-stats">
        <div className={timeLeft <= 30 ? "stat stat-warn" : "stat"}>
          <span className="stat-label">დარჩენილი დრო</span>
          <span className="stat-value">
            {minutes}:{seconds}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">კითხვა</span>
          <span className="stat-value">
            {state.current + 1} / {total}
          </span>
        </div>
      </div>
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

      <div className="test-nav">
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
