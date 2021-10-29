import React from "react";
import "./BigButton.scss";
import { useHistory } from "react-router-dom";
type Props = {
  text: string;
  to: string;
};

export const BigButton: React.FC<Props> = ({ text, to }) => {
  const history = useHistory();
  const move = () => {
    history.push(to);
  };
  return (
    <div className="big-button">
      <button className="big-button__btn" onClick={move}>
        {text}
      </button>
    </div>
  );
};
