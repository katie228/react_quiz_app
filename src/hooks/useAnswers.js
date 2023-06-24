import { get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useAnswers(taskID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    async function fetchAnswers() {
      const db = getDatabase();
      const answerRef = ref(db, "quizzes/" + taskID + "/questions");
      const answerQuery = query(answerRef, orderByKey());

      try {
        setError(false);
        setLoading(true);
        const snapshot = await get(answerQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setAnswers((prevAnswers) => {
            return [...Object.values(snapshot.val())];
          });
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }

    fetchAnswers();
  }, [taskID]);

  useEffect(() => {
    async function fetchAnswers() {
      try {
        const db = getDatabase();
        const answerRef = ref(db, "quizzes/");
        const snapshot = await get(answerRef);

        const tasks = [];

        snapshot.forEach((quizSnapshot) => {
          const quiz = quizSnapshot.val();
          if (quiz.id === taskID) {
            const quizAnswersRef = ref(
              db,
              "quizzes/" + quizSnapshot.key + "/questions"
            );
            const task = get(quizAnswersRef).then((quizAnswersSnapshot) => {
              if (quizAnswersSnapshot.exists()) {
                return Object.values(quizAnswersSnapshot.val());
              }
            });
            tasks.push(task);
          }
        });

        const results = await Promise.all(tasks);
        const answers = results.flat().filter(Boolean);
        setAnswers(answers);

        setLoading(false);
        setError(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }

    fetchAnswers();
  }, [taskID]);

  return {
    loading,
    error,
    answers,
  };
}
