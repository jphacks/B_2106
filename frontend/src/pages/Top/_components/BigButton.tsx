import React from "react";
import "./BigButton.scss";
type Props = {
  text: string;
};

export const BigButton: React.FC<Props> = ({ text }) => {
  return (
    <div className="big-button">
      <button className="big-button__btn" type="button">
        {text}
      </button>
    </div>
  );
};
