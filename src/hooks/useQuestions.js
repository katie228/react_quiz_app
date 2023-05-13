import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useQuestions(taskID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const db = getDatabase();
        const quizzesRef = ref(db, "quizzes/");
        const snapshot = await get(quizzesRef);

        const tasks = [];

        snapshot.forEach((quizSnapshot) => {
          const quiz = quizSnapshot.val();
          if (quiz.id === taskID) {
            const quizQuestionsRef = ref(
              db,
              "quizzes/" + quizSnapshot.key + "/questions"
            );
            const task = get(quizQuestionsRef).then((quizQuestionsSnapshot) => {
              if (quizQuestionsSnapshot.exists()) {
                return Object.values(quizQuestionsSnapshot.val());
              }
            });
            tasks.push(task);
          }
        });

        const results = await Promise.all(tasks);
        const questions = results.flat().filter(Boolean);
        setQuestions(questions);

        setLoading(false);
        setError(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }

    fetchQuestions();
  }, [taskID]);

  return {
    loading,
    error,
    questions,
  };
}
