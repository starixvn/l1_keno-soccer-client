import React from "react";

import appSettings from "../../common/app-settings";
import Game from "../game";
import Styles from "./game-list.module.scss";

export default function GameList() {
    const { offeredGames, gameSettings } = appSettings;
    return (
        <div className="game-container game-wrapper">
            <div className={`${Styles["game-list"]}`}>
                {offeredGames.map((gameId: number) => (
                    <Game key={gameId} {...gameSettings[gameId]} />
                ))}
            </div>
        </div>
    );
}
