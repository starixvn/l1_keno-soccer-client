import React, { useEffect, useState } from "react";

import Styles from "./header.module.scss";

type Props = {
    roundId: number;
    remainingTime: number;
};

export default function GameHeader(props: Props) {
    return (
        <div className={Styles.header}>
            <div className={Styles["header-content"]}>
                <HeaderCounter remainingTime={props.remainingTime} />
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
                <div className={Styles.timer}>00:{counter}</div>
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
