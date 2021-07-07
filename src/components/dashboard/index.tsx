import React from "react";
import { AuthorizeResponse, SSOResponse } from "sc-user-service-client/dist/auth";

import { authorize } from "../../services";
import Register from "./register";

type Props = {
    session: SSOResponse;
};
type State = { authorizeInfo: AuthorizeResponse };

class Dashboard extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { authorizeInfo: null };
        this.handleRegisterSuccess = this.handleRegisterSuccess.bind(this);
    }

    async componentDidMount() {
        const authorizeInfo = (await authorize(this.props.session)) as AuthorizeResponse;
        this.setState({ authorizeInfo });
    }

    handleRegisterSuccess(authorizeInfo: AuthorizeResponse) {
        this.setState({ authorizeInfo });
    }

    render() {
        const { authorizeInfo } = this.state;

        if (authorizeInfo) {
            return authorizeInfo.authorized ? (
                <div>Dashboard</div>
            ) : (
                <Register session={this.props.session} handleStateLogin={this.handleRegisterSuccess} />
            );
        }

        return <></>;
    }
}

export default Dashboard;
