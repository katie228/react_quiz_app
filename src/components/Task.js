import image from "../assets/images/3.jpg";
import classes from "../styles/Task.module.css";

export default function Task({ title, id, totalpoints, totalquestions }) {
  return (
    <div className={classes.task}>
      <img src={image} alt={title} />
      <p>{title}</p>
      <div className={classes.qmeta}>
        <p>{totalquestions} Вопросов</p>
        <p>Всего баллов : {totalpoints}</p>
      </div>
    </div>
  );
}
