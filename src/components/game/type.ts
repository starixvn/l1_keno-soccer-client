import { WithTranslation } from "next-i18next";
import { WithRouterProps } from "next/dist/client/with-router";
import { SSOResponse } from "sc-user-service-client/dist/auth";

export enum GameState {
    None,
    Disabled,
    ShowFullTimeResult,
    ShowFullTimeSettlementResult,
    HalfTime,
    ShowHalfTimeResult,
    ShowHalfTimeSettlementResult,
    FullTime,
    LockingBet,
}

export interface GameConfigs {
    odds: { [key: string]: number };
    minbet: number;
    maxbet: number;
    choices_maxbet: any;
}

export interface Result {
    home: number[];
    away: number[];
}

export interface SettlementResult {
    home: boolean;
    away: boolean;
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
}

export interface HalfResult {
    result: Result;
    sum: number;
    settlementResult: SettlementResult;
    time: Date;
}

export interface Round {
    roundId: number;
    halfTime: HalfResult;
    fullTime: HalfResult;
    time: Date;
}

export interface GameDurations {
    wholeRound: number;
    halfTimePlacingBets: number;
    halfTimeLockingBet: number;
    finishHalfTime: number;
    showHalfTimeSettlementResult: number;
    fullTimePlacingBets: number;
    fullTimeLockingBet: number;
    showFullTimeSettlementResult: number;
}

export type GameSetting = {
    id: number;
    gameName: string;
    durations: GameDurations;
};

export type Props = {
    session: SSOResponse;
} & GameSetting &
    WithTranslation &
    WithRouterProps;

export type State = {
    signedIn: boolean;
    gameState: GameState;
    remainingTime: number;
    gameConfigs: GameConfigs;
    roundId: number;
    roundHistory: Round[];
    ownBets: object;
    result?: Result;
    settlementResult?: SettlementResult;
};
