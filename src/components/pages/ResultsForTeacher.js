import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ResultsFT.css";

export default function ResultsFT() {
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortedResults, setSortedResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchResults() {
      const { uid } = currentUser;

      const db = getDatabase();
      const rolesRef = ref(db, "roles");

      const rolesSnapshot = await get(rolesRef);

      if (rolesSnapshot.exists()) {
        const rolesData = rolesSnapshot.val();
        const userRole = rolesData[uid]?.role;
        console.log(userRole);
        const resultsList = [];

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

  useEffect(() => {
    const filterResults = (results, filter) => {
      return results.filter((result) => {
        const displayNameMatch = result.displayName
          .toLowerCase()
          .includes(filter.toLowerCase());
        const disciplineMatch = result.discipline
          .toLowerCase()
          .includes(filter.toLowerCase());
        const titleMatch = result.title
          .toLowerCase()
          .includes(filter.toLowerCase());
        return displayNameMatch || disciplineMatch || titleMatch;
      });
    };

    const sortResults = (results) => {
      return results.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        console.log(dateA, dateB);
        return dateB - dateA;
      });
    };

    const filteredResults = filterResults(results, filter);
    const sortedFilteredResults = sortResults(filteredResults);

    setSortedResults(sortedFilteredResults);
  }, [results, filter]);

  return (
    <div className="results-container">
      <h1>Результаты тестирования</h1>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Поиск"
      />
      {sortedResults.length > 0 ? (
        <ul className="results-list">
          {sortedResults.map((result) => (
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
        <p></p>
      )}
    </div>
  );
}
