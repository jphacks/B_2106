import React from "react";
import "./Button.scss";

type Props = {
  text: string;
};

const Button: React.FC<Props> = ({ text }) => {
  return <button className="Button">{text}</button>;
};
export default Button;
