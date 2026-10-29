import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf-8"));

initializeApp({ credential: cert(read("../serviceAccountKey.json")) });
const db = getFirestore();

const tests = read("./tests.json");
const batch = db.batch();
for (const test of tests) {
  batch.set(db.collection("tests").doc(String(test.id)), test);
}
await batch.commit();

console.log(`ატვირთულია ${tests.length} ტესტი`);
