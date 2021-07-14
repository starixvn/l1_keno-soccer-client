import React from "react";

import appSettings from "../../common/app-settings";
import Game from "../game";
import Styles from "./game-list.module.scss";

export default function GameList({ session }) {
    const { offeredGames, gameSettings } = appSettings;
    return (
        <div className="game-container game-wrapper">
            <div className={`${Styles["game-list"]}`}>
                {offeredGames.map((gameId: number) => {
                    const props = { session, ...gameSettings[gameId] };
                    return <Game key={gameId} {...props} />;
                })}
            </div>
        </div>
    );
}
