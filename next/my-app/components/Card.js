import React from "react";
import styles from "./Card.module.css";
import classnames from 'classnames';


const Card = ({ item, active, onCardClick }) => {
  return (
    <div
      className={classnames(styles.cardWrapper, {[styles.clicked] : active})}
      onClick={() => onCardClick(item.id)}
    >
      <div className={styles.imgWrapper}>
        <img src={item.img} alt={item.name} />
      </div>
      <div className={styles.footer}>
        <div>{`${item.filter}`}</div>
        <div>{item.clicks}</div>
      </div>
    </div>
  );
};

export default Card;
