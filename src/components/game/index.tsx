import React from "react";
import { io, Socket } from "socket.io-client";

import appSettings from "../../common/app-settings";
import DrawResult from "./draw-result";
import Styles from "./game.module.scss";
import GameHeader from "./header";
import MessageTransmitter from "./message-transmitter";
import { MessageTransmitterType } from "./message-transmitter/type";
import { GameState, Props, State } from "./type";

class Game extends React.PureComponent<Props, State> {
    private readonly defaultGameConfig = { odds: {}, minbet: 0, maxbet: 0, choices_maxbet: {} };
    private readonly messageTransmitter: MessageTransmitterType;
    private readonly defaultResult = {
        home: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        away: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    private socket: Socket;
    private interval: NodeJS.Timeout;
    private timeCounter: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            roundId: 0,
            roundHistory: [],
            remainingTime: 0,
            gameConfigs: this.defaultGameConfig,
            ownBets: {},
            halfTimeResult: this.defaultResult,
            fullTimeResult: this.defaultResult,
            activeHalfTimeResult: false,
        };

        this.messageTransmitter = new MessageTransmitter();
        this.registerMessageHandler();
    }

    componentDidMount() {
        this.initSocket();
    }

    componentWillUnmount() {
        this.messageTransmitter.clearAllListener();
    }

    render() {
        const { gameState, roundId, halfTimeResult, fullTimeResult, remainingTime, activeHalfTimeResult } = this.state;
        return (
            <div className={Styles["game-container"]}>
                <GameHeader roundId={roundId} remainingTime={remainingTime} gameState={gameState} gameDurations={this.props.durations} />
                <div className={Styles.game}>
                    <div className={Styles["top-panel"]}>
                        <DrawResult
                            gameState={gameState}
                            halfTimeResult={halfTimeResult}
                            fullTimeResult={fullTimeResult}
                            isHalfTimeActive={activeHalfTimeResult}
                        />
                    </div>
                    <div className={Styles["bottom-panel"]}></div>
                </div>
            </div>
        );
    }

    initSocket() {
        const { gameName, session } = this.props;
        const { proxy } = appSettings;
        const socketUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri}/user/${gameName.toLowerCase()}`;
        this.socket = io(socketUri, {
            transports: ["websocket"],
            upgrade: false,
            path: `${proxy.path}/kenosoccer/socket.io`,
        });

        this.socket.on("connect", () => {
            this.socket.emit("signin", session);
        });
        this.socket.on("signedIn", () => {
            this.setState({ signedIn: true });
            this.socket.emit("inGame");
        });

        this.socket.on(this.props.gameName, this.messageTransmitter.broadcast.bind(this));

        this.socket.on("disconnect", () => {
            this.setState({ gameState: GameState.None });
        });
    }

    registerMessageHandler = () => {
        //this.messageTransmitter.register("um", this.handleUM.bind(this));
        this.messageTransmitter.register("remainingTime", this.handleRemainingTime.bind(this));
        this.messageTransmitter.register("gameConfigs", this.handleGameConfigs.bind(this));
        this.messageTransmitter.register("roundHistory", this.handleRoundHistory.bind(this));
        this.messageTransmitter.register("finishHalfTime", this.handleFinishHalfTime.bind(this));
        this.messageTransmitter.register("finish", this.handleFinish.bind(this));
        //this.messageTransmitter.register("status", this.handleStatus.bind(this));
        //this.messageTransmitter.register("user", this.handleUserData.bind(this));
        //this.messageTransmitter.register("totalBets", this.handleTotalBet.bind(this));
        this.messageTransmitter.register("ownBets", this.handleOwnBets.bind(this));
        //this.messageTransmitter.register("betPercentage", this.handlePercentageBets.bind(this));
        //this.messageTransmitter.register("endBet", this.handleEndBet.bind(this));
        //this.messageTransmitter.register("apiError", this.handleApiError.bind(this));
        //this.messageTransmitter.register("userStakeLevel", this.handleUserStakeLevel.bind(this));
    };

    handleRemainingTime({ remainingTime }) {
        if (this.state.gameState === GameState.None) {
            this.runGame(remainingTime);
        }
    }

    runGame(remainingTime: number) {
        this.timeCounter = remainingTime;

        this.interval && clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.timeCounter > 0) {
                this.timeCounter = this.timeCounter - 1;
            }

            this.handleGamePlay(this.timeCounter);
        }, 1000);

        this.handleGamePlay(remainingTime);
    }

    handleGamePlay(remainingTime: number) {
        const { durations } = this.props;
        const activeHalfTimeResult = remainingTime <= durations.resetResult && remainingTime >= 0;

        if (this.state.activeHalfTimeResult !== activeHalfTimeResult) {
            this.setState({ activeHalfTimeResult });
        }

        if (remainingTime === durations.resetResult) {
            this.setState({ halfTimeResult: this.defaultResult, fullTimeResult: this.defaultResult });
        }

        const newGameState = this.determineGameState(remainingTime);

        if (this.state.gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                ...this.getStateByNextGameState(newGameState),
            };

            this.setState(newState);
        }
    }

    determineGameState(remainingTime: number) {
        const { durations } = this.props;

        switch (true) {
            case remainingTime <= durations.wholeRound && remainingTime > durations.showFullTimeSettlementResult:
                return GameState.ShowFullTimeResult;
            case remainingTime <= durations.showFullTimeSettlementResult && remainingTime > durations.halfTimePlacingBets:
                return GameState.ShowFullTimeSettlementResult;
            case remainingTime <= durations.halfTimePlacingBets && remainingTime > durations.halfTimeLockingBet:
                return GameState.HalfTime;
            case remainingTime <= durations.halfTimeLockingBet && remainingTime >= durations.finishHalfTime:
                return GameState.HalfTimeLockingBet;
            case remainingTime <= durations.finishHalfTime && remainingTime > durations.halfTimeLockingBet:
                return GameState.ShowHalfTimeResult;
            case remainingTime <= durations.showHalfTimeSettlementResult && remainingTime > durations.halfTimePlacingBets:
                return GameState.ShowHalfTimeSettlementResult;
            case remainingTime <= durations.fullTimePlacingBets && remainingTime > durations.fullTimeLockingBet:
                return GameState.FullTime;
            case remainingTime <= durations.fullTimeLockingBet && remainingTime >= 0:
                return GameState.FullTimeLockingBet;
            default:
                return GameState.None;
        }
    }

    getStateByNextGameState(nextGameState: GameState) {
        const newStateDetector = [
            {
                condition: nextGameState === GameState.HalfTime,
                state: {
                    roundId: this.state.roundId + 1,
                    ownBets: {},

                    settlementResult: {},
                },
            },
        ];

        return newStateDetector.reduce(
            (newState, stateDetector) => {
                if (stateDetector.condition) {
                    newState = Object.assign(newState, stateDetector.state);
                }

                return newState;
            },
            { remainingTime: this.timeCounter }
        );
    }

    handleGameConfigs({ gameConfigs }) {
        this.setState({ gameConfigs });
    }

    handleRoundHistory({ roundHistory, roundId }) {
        const { gameState } = this.state;

        this.setState({
            roundHistory: roundHistory.slice(0, 40),
            roundId: [GameState.ShowFullTimeResult, GameState.ShowFullTimeSettlementResult].includes(gameState) ? roundId - 1 : roundId,
        });
    }

    handleFinishHalfTime({ finishHalfTime }) {
        this.setState({
            halfTimeResult: finishHalfTime.result,
            settlementResult: finishHalfTime.settlementResult,
        });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const { durations } = this.props;
        const roundHistoryClone = [...roundHistory];

        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            fullTimeResult: finish.result,
            settlementResult: finish.settlementResult,
            roundHistory: roundHistoryClone,
        });

        this.runGame(durations.wholeRound);
    }

    handleOwnBets = ({ ownBets, gameConfigs }) => {
        gameConfigs && this.setState({ ownBets });
    };
}

export default Game;
