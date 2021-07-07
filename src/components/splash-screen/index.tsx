import lottie from "lottie-web";
import { useEffect, useRef } from "react";
import { isMobileOnly } from "react-device-detect";

import * as animationData from "./animation-data";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen({ locale }) {
    const wrapperRefLogo = useRef<HTMLDivElement>(null);
    const device = isMobileOnly ? "mobile" : "desktop";

    useEffect(() => {
        if (wrapperRefLogo.current) {
            lottie.loadAnimation({
                container: wrapperRefLogo.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animationData[locale][device],
            });
        }
    }, [wrapperRefLogo]);

    return <div className={Styles.page} ref={wrapperRefLogo}></div>;
}
