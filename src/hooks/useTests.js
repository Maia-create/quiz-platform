import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

let request = null;

function loadTests() {
  if (!request) {
    request = getDocs(collection(db, "tests"))
      .then((snap) => snap.docs.map((d) => d.data()).sort((a, b) => a.id - b.id))
      .catch((err) => {
        request = null;
        throw err;
      });
  }
  return request;
}

export function useTests() {
  const [state, setState] = useState({ tests: [], loading: true, error: false });

  useEffect(() => {
    let active = true;
    loadTests()
      .then((tests) => active && setState({ tests, loading: false, error: false }))
      .catch(() => active && setState({ tests: [], loading: false, error: true }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
