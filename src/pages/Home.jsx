import { useState } from "react";
import tests from "../data/tests.json";
import TestCard from "../components/TestCard";

const levels = ["შესავალი", "მარტივი", "საშუალო", "რთული", "ძალიან რთული"];

function Home() {
  const [topic, setTopic] = useState("ყველა");
  const [level, setLevel] = useState("ყველა");

  const filtered = tests.filter((t) => {
    const matchTopic = topic === "ყველა" || t.title.startsWith(topic);
    const matchLevel = level === "ყველა" || t.difficulty === level;
    return matchTopic && matchLevel;
  });

  return (
    <div>
      <h2>ტესტების სია</h2>

      <div className="filters">
        <div className="chips">
          {["ყველა", "HTML", "CSS"].map((t) => (
            <button
              key={t}
              className={topic === t ? "chip active" : "chip"}
              onClick={() => setTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="ყველა">ყველა დონე</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>ტესტი ვერ მოიძებნა</p>
      ) : (
        filtered.map((test) => <TestCard key={test.id} test={test} />)
      )}
    </div>
  );
}

export default Home;