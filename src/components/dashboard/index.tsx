import React from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";

class Dashboard extends React.PureComponent<{ session: SSOResponse }> {
    render() {
        return <div>Dashboard</div>;
    }
}

export default Dashboard;
