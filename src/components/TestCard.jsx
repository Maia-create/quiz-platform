import { Link } from "react-router-dom";

function TestCard({ test }) {
  return (
    <div className="test-card">
      <h3>{test.title}</h3>
      <p>
        სირთულე: {test.difficulty} | კითხვები: {test.questions.length} | დრო:{" "}
        {test.timeLimit / 60} წთ
      </p>
      <Link to={`/test/${test.id}`}>დაწყება</Link>
    </div>
  );
}

export default TestCard;