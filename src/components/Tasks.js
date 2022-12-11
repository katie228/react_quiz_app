import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import useTaskList from "../hooks/useTaskList";
import Task from "./Task";

export default function Tasks() {
  const [page, setPage] = useState(1);
  const { loading, error, tasks, hasMore } = useTaskList(page);

  return (
    <div>
      {tasks.length > 0 && (
        <InfiniteScroll
          dataLength={tasks.length}
          hasMore={hasMore}
          loader="Загрузка..."
          next={() => setPage(page + 8)}
        >
          {tasks.map((task) =>
            task.noq > 0 ? (
              <Link
                to={{
                  pathname: `/quiz/${task.youtubeID}`,
                  state: {
                    taskTitle: task.title,
                  },
                }}
                key={task.youtubeID}
              >
                <Task title={task.title} id={task.youtubeID} noq={task.noq} />
              </Link>
            ) : (
              <Task
                title={task.title}
                id={task.youtubeID}
                noq={task.noq}
                key={task.youtubeID}
              />
            )
          )}
        </InfiniteScroll>
      )}
      {!loading && tasks.length === 0 && <div>Данные не найдены!</div>}
      {error && <div>Ошибка!</div>}
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
