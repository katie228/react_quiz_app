import image from "../assets/images/success.png";
import classes from "../styles/Summary.module.css";

export default function Summary({ score, noq }) {
  return (
    <div class={classes.summary}>
      <div className={classes.point}>
        <p className={classes.score}>
          Вы набрали <br />
          {score} баллов из {noq * 5}!
        </p>
      </div>

      <div className={classes.badge}>
        <img src={image} alt="Success" />
      </div>
    </div>
  );
}
