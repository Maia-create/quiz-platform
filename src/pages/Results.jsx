import { useLocation, Link } from "react-router-dom";
import tests from "../data/tests.json";

function Results() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div>
        <p>შედეგი არ არის.</p>
        <div className="actions">
          <Link to="/" className="btn">
            მთავარზე დაბრუნება
          </Link>
        </div>
      </div>
    );
  }

  const test = tests.find((t) => t.id === state.testId);
  const total = test.questions.length;
  const score = test.questions.filter(
    (q, i) => state.answers[i] === q.correct
  ).length;

  return (
    <div>
      <h2>{test.title}: შედეგი</h2>
      <p>
        სწორი პასუხები: {score} / {total}
      </p>

      {test.questions.map((q, i) => {
        const userAnswer = state.answers[i];
        const isCorrect = userAnswer === q.correct;
        return (
          <div key={q.id}>
            <h4>{i + 1}. {q.question}</h4>
            <p>
              თქვენი პასუხი:{" "}
              {userAnswer !== undefined ? q.options[userAnswer] : "პასუხი არ არის"}{" "}
              {isCorrect ? "✅" : "❌"}
            </p>
            {!isCorrect && <p>სწორი პასუხი: {q.options[q.correct]}</p>}
          </div>
        );
      })}

      <div className="actions">
        <Link to="/" className="btn">
          მთავარზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}

export default Results;