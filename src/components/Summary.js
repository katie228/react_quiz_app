import image from "../assets/images/success.png";
import classes from "../styles/Summary.module.css";

export default function Summary({ score, totalquestions }) {
  return (
    <div class={classes.summary}>
      <div className={classes.point}>
        <p className={classes.score}>
          Вы набрали <br />
          {score} баллов из {totalquestions * 5}!
        </p>
      </div>

      <div className={classes.badge}>
        <img src={image} alt="Success" />
      </div>
    </div>
  );
}
