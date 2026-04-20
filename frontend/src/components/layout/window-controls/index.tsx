import { tinyLogo } from "../../../assets";

import style from "./styles.module.css";

export function WindowControls() {
  return (
    <div className={style.windowControls}>
      <img src={tinyLogo} alt="logo" className={style.logo} />
    </div>
  );
}
