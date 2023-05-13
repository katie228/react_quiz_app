import image from "../assets/images/success.png";
import classes from "../styles/Summary.module.css";

export default function Summary({ score, totalPoints, totalQuestions }) {
  return (
    <div className={classes.summary}>
      <div className={classes.point}>
        <p className={classes.score}>
          Вы набрали <br />
          {score} баллов из {totalPoints}!
        </p>
      </div>

      <div className={classes.badge}>
        <img src={image} alt="Success" />
      </div>

      <p>Всего вопросов: {totalQuestions}</p>
    </div>
  );
}
