import { appWithTranslation } from "next-i18next";
import App, { AppProps } from "next/app";
import React from "react";

interface KenoSoccerAppProps extends AppProps {
    err: any;
}

class KenoSoccerApp extends App<KenoSoccerAppProps> {
    render() {
        const { Component, pageProps, err } = this.props;

        return <Component {...pageProps} err={err} />;
    }
}

export default appWithTranslation(KenoSoccerApp);
