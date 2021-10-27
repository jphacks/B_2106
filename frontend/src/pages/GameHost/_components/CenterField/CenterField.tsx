import React, { ReactElement } from "react";
import "./CenterField.scss";

interface Props {
  styles?: any;
}

const CenterField: React.FC<Props> = (props) => {
  interface Fields {
    point: ReactElement[];
    kaze: ReactElement[];
  }

  const fields: Fields = {
    point: [],
    kaze: [],
  };

  for (let i = 0; i < 1; i++) {
    fields.point.push(
      <div key={i} className="center-field__point">
        {25000}
      </div>
    );

    fields.kaze.push(
      <div key={i} className="center-field__kaze">
        {"東"}
      </div>
    );
  }

  const centerField = (
    <div className="center-field" style={props.styles}>
      <div className="center-field__tsumo-button" />
      {fields.point}
      {fields.kaze}
    </div>
  );

  return centerField;
};

export default CenterField;
