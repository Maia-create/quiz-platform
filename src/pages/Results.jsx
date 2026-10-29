import { useLocation, Link } from "react-router-dom";
import { useTests } from "../hooks/useTests";

function Results() {
  const { state } = useLocation();
  const { tests, loading } = useTests();

  if (loading) return <p>იტვირთება...</p>;

  const test = state && tests.find((t) => t.id === state.testId);

  if (!test) {
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