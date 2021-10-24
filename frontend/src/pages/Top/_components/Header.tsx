import React from "react";
type Props = {
  text: string;
};

export const Header: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <h1> {text} </h1>
    </div>
  );
};
