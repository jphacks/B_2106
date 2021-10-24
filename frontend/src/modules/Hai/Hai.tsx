import React from "react";
import classNames from "classnames";
import "./Hai.scss";
import { imageEnum } from "../../data/ImageEnum";

interface Props {
  name: string;
  direction: "up" | "right" | "left" | "down";
  is3d: boolean;
  styles?: any;
}

const Hai: React.FC<Props> = (props) => {
  let url = "";

  try {
    url = imageEnum[`_${props.name}`].imageUrl;
  } catch (e) {
    if (e instanceof TypeError) {
      console.error("Error: 牌の名前が不正です\n", e.message);
    }
  }

  let angle = 0;

  if (props.direction === "right" || props.direction === "left") {
    url = url.replace(".png", "-yoko.png");

    if (props.direction === "right") {
      angle = 180;
    }
  } else if (props.direction === "down") {
    angle = 180;
  }

  const hai = (
    <div
      className={classNames("Hai", { "Hai-3d": props.is3d })}
      style={props.styles}
    >
      {props.is3d ? (
        <div className="Hai-3d__contents">
          <div className="Hai-3d__contents__depth" />
          <img src={url} style={{ transform: "rotate(" + angle + "deg)" }} />
        </div>
      ) : (
        <img src={url} style={{ transform: "rotate(" + angle + "deg)" }} />
      )}
    </div>
  );

  return hai;
};

export default Hai;
