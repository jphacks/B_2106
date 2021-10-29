import classNames from "classnames";
import React, { useState } from "react";
import Hai from "../../_components/Hai/Hai";
import Hougaku from "../../_components/Hougaku/Hougaku";
import "./style.scss";
import Button from "./_components/Button";
export const GameClient = () => {
  //将来的にはreduxで管理する変数
  const haiList = [
    "1m",
    "1m",
    "1m",
    "2m",
    "3m",
    "4m",
    "5m",
    "6m",
    "7m",
    "8m",
    "9m",
    "9m",
    "9m",
  ];

  const tsumo = "1m";
  const canRon = false;
  const canTsumoagari = true;
  const turnPlayer = 2;
  const myNumber = 3;

  const [selectIdx, setSelectIdx] = useState<number>(-1);

  const haiClick = (index: number) => {
    if (index == selectIdx) {
      console.log("double tapped!!");
    } else setSelectIdx(index);
  };

  return (
    <div className="ClientView">
      <div className="ClientView__hougaku">
        <Hougaku
          {...{
            text: "北",
            device: "client",
            direction: "down",
            isLighting: true,
          }}
        />
      </div>
      <div className="ClientView__hai_container">
        {haiList.map((hai, index) => (
          <div
            key={index}
            className={classNames("ClientView__Hai", {
              "ClientView__Hai--float": index == selectIdx,
            })}
            onClick={() => haiClick(index)}
          >
            <Hai {...{ name: hai, is3d: true, direction: "up" }} />
          </div>
        ))}
        <div
          className={classNames("ClientView__Hai", {
            "ClientView__Hai--float": 14 == selectIdx,
          })}
          onClick={() => haiClick(14)}
        >
          <Hai {...{ name: tsumo, is3d: true, direction: "up" }} />
        </div>
      </div>
      <div className="ClientView__buttons">
        {canRon && (
          <div className="ClientView__Action">
            <Button text="ロン" />
          </div>
        )}
        {canTsumoagari && (
          <div className="ClientView__Action">
            <Button text="ツモ" />
          </div>
        )}
      </div>
    </div>
  );
};
