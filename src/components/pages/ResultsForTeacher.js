import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ResultsFT.css";

export default function ResultsFT() {
  const [results, setResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchResults() {
      const { uid } = currentUser;

      const db = getDatabase();
      const rolesRef = ref(db, "roles");

      const rolesSnapshot = await get(rolesRef);

      if (rolesSnapshot.exists()) {
        const rolesData = rolesSnapshot.val();
        const userRole = rolesData[uid]?.role; // Получаем роль текущего пользователя
        console.log(userRole);
        const resultsList = [];

        // Если пользователь - преподаватель, загружаем результаты всех студентов
        if (userRole === "teacher") {
          const resultsRef = ref(db, "result");
          const resultsSnapshot = await get(resultsRef);

          if (resultsSnapshot.exists()) {
            const allResults = resultsSnapshot.val();

            for (const studentUid in allResults) {
              const studentResults = allResults[studentUid];

              for (const testId in studentResults) {
                const testResults = studentResults[testId];

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
                          displayName: testResults[resultId].displayName,
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
            }
          }
        }

        // Если пользователь - студент, загружаем только его результаты
        if (userRole === "student") {
          const studentResultsRef = ref(db, `result/${uid}`);
          const studentResultsSnapshot = await get(studentResultsRef);

          if (studentResultsSnapshot.exists()) {
            const studentResults = studentResultsSnapshot.val();

            for (const testId in studentResults) {
              const testResults = studentResults[testId];

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
                        displayName: testResults[resultId].displayName,
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
        <p>Загрузка..</p>
      )}
    </div>
  );
}
