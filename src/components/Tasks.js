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
          loader=""
          next={() => setPage(page + 8)}
        >
          {tasks.map((task) =>
            task.totalquestions > 0 ? (
              <Link
                to={{
                  pathname: `/quiz/${task.id}`,
                  state: {
                    taskTitle: task.title,
                  },
                }}
                key={task.id}
              >
                <Task
                  title={task.title}
                  id={task.id}
                  totalquestions={task.totalquestions}
                  totalpoints={task.totalpoints}
                />
              </Link>
            ) : (
              <Task
                title={task.title}
                id={task.id}
                totalquestions={task.totalquestions}
                key={task.id}
                totalpoints={task.totalpoints}
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
