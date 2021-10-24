import React from "react";
import "./BigButton.scss";
type Props = {
  text: string;
};

export const BigButton: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <button type="button">{text}</button>
    </div>
  );
};
