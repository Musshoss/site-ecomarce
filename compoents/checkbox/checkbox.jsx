import { use, useState, useEffect } from "react";
import styles from "./checkbox.module.sass";
import axios from "axios";
import { on } from "events";

const ModernCheckbox = ({ label, isChecked, onChange }) => {
  return (
    <label className={styles.container}>
      <div className={styles.ModernCheckbox}>
        <input type="checkbox" onChange={onChange} checked={isChecked} />
        <span className={styles.checkMark}></span>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default ModernCheckbox;
