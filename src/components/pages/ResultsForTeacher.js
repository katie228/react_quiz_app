import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ResultsFT() {
  const [results, setResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchResults() {
      const { uid, displayName } = currentUser;

      const db = getDatabase();
      const resultsRef = ref(db, `result/${uid}`);

      const snapshot = await get(resultsRef);

      if (snapshot.exists()) {
        const userResults = snapshot.val();
        const resultsList = [];

        Object.keys(userResults).forEach((testId) => {
          const testResults = userResults[testId];
          Object.keys(testResults).forEach((resultId) => {
            resultsList.push({
              testId,
              resultId,
              displayName,
              ...testResults[resultId],
            });
          });
        });

        setResults(resultsList);
      }
    }

    fetchResults();
  }, [currentUser]);

  return (
    <div>
      <h1>Результаты тестирования</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.resultId}>
              <p>Пользователь: {result.displayName}</p>
              <p>Тест: {result.testId}</p>
              <p>Дата прохождения: {result.timestamp}</p>
              <p>Результат: {result.score}</p>
              {/* Другие данные результата, которые вы хотите отобразить */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет доступных результатов</p>
      )}
    </div>
  );
}
