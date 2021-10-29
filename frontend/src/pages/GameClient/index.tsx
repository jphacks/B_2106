import classNames from "classnames";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../store";
import Hai from "../../_components/Hai/Hai";
import Hougaku from "../../_components/Hougaku/Hougaku";
import { selectClientFlag } from "./ClientFlagSlice";
import "./style.scss";
import { selectTehai } from "./TehaiSlice";
import { tsumo as tsumoAction, haipai, dahai, tsumogiri } from "./TehaiSlice";
import { setTurn, setFuro } from "./ClientFlagSlice";
import Button from "./_components/Button";
export const GameClient = () => {
  //将来的にはreduxで管理する変数
  const { tsumo, tehai } = useSelector(selectTehai);
  const { canRon, canTsumoagari, canDahai, isMyturn } =
    useSelector(selectClientFlag);
  const [selectIdx, setSelectIdx] = useState<number>(-1);
  const dispatch = store.dispatch;
  useEffect(() => {
    dispatch(tsumoAction("3m"));
    dispatch(haipai(["1m", "1m", "1m", "1m", "1m", "1m", "1m", "2m"]));
    dispatch(dahai(6));
    dispatch(tsumoAction("4m"));
    dispatch(tsumogiri());
    dispatch(setTurn({ isMyturn: true, canTsumoagari: true, canDahai: true }));
    dispatch(setFuro({ canRon: true }));
  }, []);

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
            isLighting: isMyturn,
          }}
        />
      </div>
      <div className="ClientView__hai_container">
        {tehai.map((hai, index) => (
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
          className={classNames("ClientView__Hai", "ClientView__Hai--tsumo", {
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
