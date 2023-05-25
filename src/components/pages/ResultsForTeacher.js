import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ResultsFT.css";

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

        for (const testId in userResults) {
          const testResults = userResults[testId];

          const quizzesRef = ref(db, "quizzes");
          const quizzesSnapshot = await get(quizzesRef);

          if (quizzesSnapshot.exists()) {
            const quizData = quizzesSnapshot.val();

            for (const quizId in quizData) {
              if (quizData[quizId].id === testId) {
                const discipline = quizData[quizId].discipline;
                const totalpoints = quizData[quizId].totalpoints;
                const title = quizData[quizId].title;

                for (const resultId in testResults) {
                  resultsList.push({
                    testId,
                    resultId,
                    displayName,
                    discipline,
                    totalpoints,
                    title,
                    ...testResults[resultId],
                  });
                }

                break;
              }
            }
          }
        }

        setResults(resultsList);
      }
    }

    fetchResults();
  }, [currentUser]);

  return (
    <div className="results-container">
      <h1>Результаты тестирования</h1>
      {results.length > 0 ? (
        <ul className="results-list">
          {results.map((result) => (
            <li key={result.resultId} className="result-item">
              <p>Пользователь: {result.displayName}</p>
              <p>Дисциплина: {result.discipline}</p>
              <p>Тема тестирования: {result.title}</p>
              <p>
                Результат: {result.score} из {result.totalpoints}
              </p>
              <p>Дата прохождения: {result.timestamp}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет доступных результатов</p>
      )}
    </div>
  );
}
