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
import {
  emitTsumogiri,
  emitDahai,
  emitRon,
  emitTsumoagari,
} from "../../services/socket";
import { KazeType } from "../../_type";
export const GameClient = () => {
  //将来的にはreduxで管理する変数
  const { kaze, tsumo, tehai } = useSelector(selectTehai);
  const { canRon, canTsumoagari, canDahai, isMyturn } =
    useSelector(selectClientFlag);
  const [selectIdx, setSelectIdx] = useState<number>(-1);
  const [orderList, setOrderList] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    const compare = (a: string, b: string) => {
      const dict = { m: "0", p: "1", s: "2", z: "3" };
      const a1: "m" | "p" | "s" | "z" = a[1] as "m" | "p" | "s" | "z";
      const b1: "m" | "p" | "s" | "z" = b[1] as "m" | "p" | "s" | "z";
      return dict[a1] + a[0] > dict[b1] + b[0];
    };
    function sortIndex(tehai: string[]) {
      return tehai.map((hai) => {
        let count = 0;
        for (let i = 0; i < tehai.length; i++) {
          count += compare(hai, tehai[i]) ? 1 : 0;
        }
        return count;
      });
    }
    setOrderList(sortIndex(tehai));
  }, [tehai]);

  const buttonClick = (action: string) => {
    if (action == "ron") {
      emitRon();
      dispatch(setFuro({ canRon: false }));
    } else if (action == "tsumoagari") {
      emitTsumoagari();
      dispatch(
        setTurn({ canDahai: false, canTsumoagari: false, isMyturn: true })
      );
    }
  };
  const haiClick = (index: number) => {
    if (index == selectIdx) {
      console.log("double tapped!!");
      if (isMyturn) {
        if (index == 14) {
          emitTsumogiri();
          dispatch(tsumogiri());
          dispatch(
            setTurn({ canDahai: false, canTsumoagari: false, isMyturn: false })
          );
        } else if (canDahai) {
          console.log("dahai!!!!!!!!!!");
          emitDahai(tehai[index]);
          dispatch(dahai(index));
          dispatch(
            setTurn({ canDahai: false, canTsumoagari: false, isMyturn: false })
          );
        }
      }
    } else setSelectIdx(index);
  };

  return (
    <div className="ClientView">
      <div className="ClientView__hougaku">
        <Hougaku
          {...{
            text: ["東", "南", "西", "北"][kaze] as KazeType,
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
            style={{ order: orderList[index] }}
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
          style={{ order: 14 }}
        >
          {tsumo ? (
            <Hai {...{ name: tsumo, is3d: true, direction: "up" }} />
          ) : (
            <div className="dummy"></div>
          )}
        </div>
      </div>
      <div className="ClientView__buttons">
        {canRon && (
          <div className="ClientView__Action">
            <Button
              text="ロン"
              onClick={() => {
                buttonClick("ron");
              }}
            />
          </div>
        )}
        {canTsumoagari && (
          <div className="ClientView__Action">
            <Button
              text="ツモ"
              onClick={() => {
                buttonClick("tsumoagari");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
