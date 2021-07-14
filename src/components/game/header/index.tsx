import React, { useEffect, useState } from "react";

import { GameDurations, GameState } from "../type";
import Styles from "./header.module.scss";

type Props = {
    roundId: number;
    remainingTime: number;
    gameState: GameState;
    gameDurations: GameDurations;
};

export default function GameHeader(props: Props) {
    const [remainingTime, setRemainingTime] = useState<number>(0);

    const { gameDurations } = props;

    useEffect(() => {
        switch (props.gameState) {
            case GameState.None:
            case GameState.Disabled:
            case GameState.ShowFullTimeResult:
            case GameState.ShowFullTimeSettlementResult:
            case GameState.ShowHalfTimeResult:
            case GameState.ShowHalfTimeSettlementResult:
                setRemainingTime(0);
                break;
            case GameState.HalfTime:
            case GameState.HalfTimeLockingBet:
                setRemainingTime(props.remainingTime - gameDurations.finishHalfTime);
                break;
            default:
                setRemainingTime(props.remainingTime);
                break;
        }
    }, [props.gameState]);

    return (
        <div className={Styles.header}>
            <div className={Styles["header-content"]}>
                <HeaderCounter key={props.gameState} remainingTime={remainingTime} />
                <HeaderTitle roundId={props.roundId} />
            </div>
            <RebetButton />
        </div>
    );
}

function HeaderTitle({ roundId }) {
    return (
        <div className={Styles["header-title-container"]}>
            <h1 className={Styles["header-title"]}>My Dinh</h1>
            <p className={Styles["draw-no"]}>
                Draw No.<span>{roundId}</span>
            </p>
        </div>
    );
}

function HeaderCounter({ remainingTime }) {
    const [counter, setCounter] = useState<number>(remainingTime);

    useEffect(() => {
        const interval = setInterval(() => {
            counter > 0 && setCounter(counter - 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <div className={Styles["header-counter-container"]}>
            <div className={Styles["header-counter"]}>
                <div className={Styles.timer}>00:{counter.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}</div>
            </div>
        </div>
    );
}

function RebetButton() {
    return (
        <div className={Styles["btnRebet"]}>
            <div>
                <a>Rebet</a>
            </div>
        </div>
    );
}
