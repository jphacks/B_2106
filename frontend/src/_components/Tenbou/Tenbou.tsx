import React from "react";
import "./Tenbou.scss";
import { DirectionType } from "../../_type";

interface Props {
  value: 100 | 1000 | 5000 | 10000;
  direction: DirectionType;
  styles?: any;
}

const Tenbou: React.FC<Props> = (props) => {
  let url = `images/hai-images/tennbou-${props.value}.png`;

  const tenbou = (
    <div className={`tenbou--${props.direction}`} style={props.styles}>
      <img src={url} className={`tenbou__img--${props.direction}`} />
    </div>
  );

  return tenbou;
};

export default Tenbou;
