import image from "../assets/images/3.jpg";
import classes from "../styles/Task.module.css";

export default function Task({ title, id, noq }) {
  return (
    <div className={classes.task}>
      <img src={image} alt={title} />
      <p>{title}</p>
      <div className={classes.qmeta}>
        <p>{noq} Вопросов</p>
        <p>Всего баллов : {noq * 5}</p>
      </div>
    </div>
  );
}
