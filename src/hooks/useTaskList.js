import {
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  query,
  ref,
  startAt,
} from "firebase/database";
import { useEffect, useState } from "react";

export default function useTaskList(page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      // database related works
      const db = getDatabase();
      const tasksRef = ref(db, "tasks");
      const taskQuery = query(
        tasksRef,
        orderByKey(),
        startAt("" + page),
        limitToFirst(200)
      );

      try {
        setError(false);
        setLoading(true);
        // request firebase database
        const snapshot = await get(taskQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setTasks((prevTasks) => {
            return [...Object.values(snapshot.val())];
          });
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }

    fetchTasks();
  }, [page]);

  return {
    loading,
    error,
    tasks,
    hasMore,
  };
}
