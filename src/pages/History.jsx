import { useLocalStorage } from "../hooks/useLocalStorage";

function History() {
  const [history, setHistory] = useLocalStorage("history", []);

  return (
    <div>
      <h2>ისტორია</h2>

      {history.length === 0 ? (
        <p>ისტორია ცარიელია</p>
      ) : (
        <>
          {[...history].reverse().map((item) => (
            <div key={item.id} className="test-card">
              <h3>{item.title}</h3>
              <p>
                შედეგი: {item.score} / {item.total}
              </p>
              <p>{item.date}</p>
            </div>
          ))}
          <button onClick={() => setHistory([])}>ისტორიის გასუფთავება</button>
        </>
      )}
    </div>
  );
}

export default History;