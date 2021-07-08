import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React from "react";
import { AuthorizeResponse, ReCheckInResponse, SSOResponse } from "sc-user-service-client/dist/auth";

import { authorize, clearSession, reCheckIn } from "../../services";
import Header from "../header";
import Register from "../register";
import Styles from "./dashboard.module.scss";

type Props = {
    session: SSOResponse;
} & WithRouterProps;

type State = { authorizeInfo: AuthorizeResponse };

class Dashboard extends React.PureComponent<Props, State> {
    private reCheckInInterval: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);

        this.state = { authorizeInfo: null };
        this.updateAuthorizeInfo = this.updateAuthorizeInfo.bind(this);
    }

    updateAuthorizeInfo(authorizeInfo: AuthorizeResponse) {
        this.setState({ authorizeInfo });
    }

    updateUserBalance(balance: number) {
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized && authorizeInfo.user.red !== balance) {
            authorizeInfo.user.red = balance;
            this.setState({ authorizeInfo });
        }
    }

    signOut() {
        clearSession();
        this.props.router.push("/timeout");
    }

    handleRecheckInResponse(response: ReCheckInResponse) {
        if (!response || !response.isSuccessful) {
            this.signOut();
        } else {
            if (response.apiError) {
                response.isDisableAccount &&
                    setTimeout(() => {
                        this.signOut();
                    }, 10000);

                //handleShowApiErrorMessage(reCheckInResult.apiError.errorCode);
            } else {
                this.updateUserBalance(response.balance);
            }
        }
    }

    async componentDidMount() {
        const authorizeInfo = (await authorize(this.props.session)) as AuthorizeResponse;
        this.updateAuthorizeInfo(authorizeInfo);

        this.reCheckInInterval = setInterval(async () => {
            const reCheckInResponse = await reCheckIn(this.props.session);
            this.handleRecheckInResponse(reCheckInResponse);
        }, 60 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.reCheckInInterval);
    }

    render() {
        const { authorizeInfo } = this.state;

        if (authorizeInfo) {
            return authorizeInfo.authorized ? (
                <div className={Styles["dashboard"]}>
                    <Header user={authorizeInfo.user} />
                </div>
            ) : (
                <Register session={this.props.session} handleStateLogin={this.updateAuthorizeInfo} />
            );
        }

        return <></>;
    }
}

export default withRouter(Dashboard);
