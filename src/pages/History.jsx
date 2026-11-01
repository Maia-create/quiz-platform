import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { db } from "../firebase";

function History() {
  const { user } = useAuth();
  const [mine, setMine] = useState(null);
  const [sort, setSort] = useState("newest");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "history"), where("userId", "==", user.id));
    return onSnapshot(
      q,
      (snap) => setMine(snap.docs.map((d) => ({ ...d.data(), docId: d.id }))),
      () => setMine([]),
    );
  }, [user.id]);

  const clearHistory = async () => {
    setConfirmClear(false);
    const batch = writeBatch(db);
    mine.forEach((h) => batch.delete(doc(db, "history", h.docId)));
    await batch.commit();
  };

  if (mine === null) return <p>იტვირთება...</p>;

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
          <div className="history-toolbar">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">ყველაზე ახალი</option>
              <option value="oldest">ყველაზე ძველი</option>
              <option value="best">საუკეთესო შედეგი</option>
              <option value="worst">ყველაზე ცუდი შედეგი</option>
            </select>
            <button
              className="btn-danger"
              onClick={() => setConfirmClear(true)}
            >
              ისტორიის გასუფთავება
            </button>
          </div>

          <ConfirmDialog
            open={confirmClear}
            title="ისტორიის გასუფთავება"
            text="ნამდვილად გსურთ ყველა შედეგის წაშლა? ამას ვეღარ დააბრუნებთ."
            confirmText="გასუფთავება"
            onConfirm={clearHistory}
            onCancel={() => setConfirmClear(false)}
          />

          {sorted.map((item) => (
            <div key={item.docId} className={`test-card ${item.title.startsWith("HTML") ? "topic-html" : "topic-css"}`}>
              <h3>{item.title}</h3>
              <p>
                შედეგი: {item.score} / {item.total}
              </p>
              <p>{item.date}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default History;