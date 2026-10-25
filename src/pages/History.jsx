import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../context/AuthContext";

function History() {
  const { user } = useAuth();
  const [history, setHistory] = useLocalStorage("history", []);
  const [sort, setSort] = useState("newest");

  const mine = history.filter((h) => h.userId === user?.id);

  const sorted = [...mine].sort((a, b) => {
    const pa = a.score / a.total;
    const pb = b.score / b.total;

    switch (sort) {
      case "oldest":
        return a.id - b.id;
      case "best":
        return pb - pa || b.id - a.id;
      case "worst":
        return pa - pb || b.id - a.id;
      default:
        return b.id - a.id;
    }
  });

  return (
    <div>
      <h2>ისტორია</h2>

      {mine.length === 0 ? (
        <p>ისტორია ცარიელია</p>
      ) : (
        <>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">ყველაზე ახალი</option>
            <option value="oldest">ყველაზე ძველი</option>
            <option value="best">საუკეთესო შედეგი</option>
            <option value="worst">ყველაზე ცუდი შედეგი</option>
          </select>

          {sorted.map((item) => (
            <div key={item.id} className={`test-card ${item.title.startsWith("HTML") ? "topic-html" : "topic-css"}`}>
              <h3>{item.title}</h3>
              <p>
                შედეგი: {item.score} / {item.total}
              </p>
              <p>{item.date}</p>
            </div>
          ))}
          <button
            onClick={() => setHistory(history.filter((h) => h.userId !== user.id))}
          >
            ისტორიის გასუფთავება
          </button>
        </>
      )}
    </div>
  );
}

export default History;