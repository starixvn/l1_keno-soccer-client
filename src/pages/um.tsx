import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React from "react";

import { convertToGMT8, formatDate } from "../helpers/time-helper";
import { UserClientCommunication } from "../services";

function UM({ umInfo }) {
    const router = useRouter();
    const { locale } = router;
    const { t } = useTranslation(["um", "messages"]);
    const template = locale === "vi" ? "hh:mm dd/MM/yyyy" : "hh:mm MM dd, yyyy";

    return (
        <div className="error-page">
            <img alt="UM" src={`/static/images/um-dark.svg`} className="error-background" />
            <p className="um-title">
                {t("messages:sysMaintenance")} <br /> {t("um:umTitleFirst")}
            </p>
            <p className="highlight">
                {t("um:umContent")
                    .toString()
                    .replace("{0}", formatDate(convertToGMT8(new Date(umInfo.start)), template))
                    .replace("{1}", formatDate(convertToGMT8(new Date(umInfo.end)), template))}
            </p>
            <p>{t("um:umNotice")}</p>
        </div>
    );
}

export async function getServerSideProps({ locale }) {
    const settingsService = UserClientCommunication.getUserClientInstance().settings;
    const settings = await settingsService.getSettings();

    return {
        props: {
            ...(await serverSideTranslations(locale, ["messages", "um"])),
            umInfo: settings.umInfo,
        },
    };
}

export default UM;
