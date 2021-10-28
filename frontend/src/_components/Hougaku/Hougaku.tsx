import React from "react";
import classNames from "classnames";
import "./Hougaku.scss";

interface Props {
  text: "東"|"西"|"北"|"南";
  isLighting?:boolean;
  direction?:"up" | "right" | "left" | "down";
  device:"host"|"client";
}

const Hougaku: React.FC<Props> = ({
    text,isLighting=false,direction="down",device
}) => {
    if(direction){console.log(direction)}
  const hougaku = (
    <div className=
        {
            classNames(
                "Hougaku",
                {
                    "Hougaku--lighting":isLighting
                },
                {
                    "Hougaku--host":device=="host",
                    "Hougaku--client":device=="client"
                },
                {
                    "Hougaku--up":direction=="up",
                    "Hougaku--down":direction=="down",
                    "Hougaku--left":direction=="left",
                    "Hougaku--right":direction=="right",
                }
            )
        }>
        <div className={classNames("Hougaku__container",{"Hougaku__container--host":device=="host","Hougaku__container--client":device=="client"})}>
            {text}
        </div>
    </div>
  );

  return hougaku;
};

export default Hougaku;
