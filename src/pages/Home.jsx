import tests from "../data/tests.json";
import TestCard from "../components/TestCard";

function Home() {
  return (
    <div>
      <h2>ტესტების სია</h2>
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
}

export default Home;
