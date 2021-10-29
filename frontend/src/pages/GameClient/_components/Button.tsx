import React from "react";
import "./Button.scss";
type Props = {
  text: string;
  onClick: <T>(param: T) => void;
};

const Button: React.FC<Props> = ({ text, onClick }) => {
  return (
    <button className="Button" onClick={onClick}>
      {text}
    </button>
  );
};
export default Button;
