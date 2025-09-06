import { useMessage } from "../../../contexts";
import { I } from "../../";

import styles from "./styles.module.css";

export const Message = () => {
  const { message, closeMessage } = useMessage();

  if (!message || !message.text) return null;

  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      {message.type === "success" && <I.check className={styles.icon} />}
      {message.type === "error" && <I.error className={styles.icon} />}
      <span className={styles.text}>{message.text}</span>
      <button type="button" onClick={closeMessage} className={styles.close}>
        <I.close />
      </button>
    </div>
  );
};
