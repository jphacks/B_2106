import React from "react";
import "./Header.scss";
type Props = {
  text: string;
};

export const Header: React.FC<Props> = ({ text }) => {
  return (
    <div className="header">
      <p className="header__title"> {text} </p>
    </div>
  );
};
