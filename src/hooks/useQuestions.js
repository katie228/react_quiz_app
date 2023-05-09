import { get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useQuestions(taskID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      // database related works
      const db = getDatabase();
      const quizRef = ref(db, "answers/" + taskID + "/questions"); //"answers/"
      const quizQuery = query(quizRef, orderByKey());

      try {
        setError(false);
        setLoading(true);
        // request firebase database
        const snapshot = await get(quizQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setQuestions((prevQuestions) => {
            return [...Object.values(snapshot.val())];
          });
        }
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
