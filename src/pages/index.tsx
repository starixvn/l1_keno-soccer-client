import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";

import Dashboard from "../components/dashboard";
import SplashScreen from "../components/splash-screen";
import { checkUM, sso, verifySession } from "../services/auth-service";

function Home() {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<SSOResponse>(null);

    useEffect(() => {
        const signIn = async () => {
            const { token } = router.query;
            const userSession = token ? await sso(token as string) : await verifySession();
            if (userSession && userSession.isAuthenticated) {
                setSession(userSession);
                setLoading(false);
            } else {
                router.push("timeout");
            }
        };

        if (router.isReady) {
            if (!checkUM()) {
                router.push("um");
            } else {
                signIn();
            }
        }

        return () => {};
    }, [router.isReady]);

    if (loading) {
        return <SplashScreen locale={router.locale} />;
    }

    return <Dashboard session={session} />;
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "register", "bethistory", "messages"])),
    },
});

export default Home;
