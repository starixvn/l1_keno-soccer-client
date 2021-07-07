import { Trans, useTranslation } from "next-i18next";
import React, { useState } from "react";
import { AuthorizeResponse, Response, SSOResponse } from "sc-user-service-client/dist/auth";

import { GetLocalizedErrorMessage } from "../../../helpers/notice-helper";
import { randomInteger } from "../../../helpers/number-helper";
import { createNickname } from "../../../services/auth-service";
import NameGenerator from "./name-generator";
import ProfilePicture from "./profile-picture";
import Styles from "./register.module.scss";

type Props = {
    session: SSOResponse;
    handleStateLogin: (authorizeInfo: AuthorizeResponse) => void;
};

const maxAvatarId = 40;
const sabaMobileName = "Saba.mobi";
const sabaClubName = "Saba.club";

export default function Register({ session, handleStateLogin }: Props) {
    const { t } = useTranslation(["register", "common", "messages"]);

    const nameAuto = NameGenerator.generateName;
    const [name, updateNameState] = useState<string>(nameAuto);
    const [isValidUserName, setIsValidUserName] = useState<boolean>(true);
    const [validateMessage, setValidateMessage] = useState<string>("");
    const selectedAvatarId = randomInteger(1, maxAvatarId);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUsername(name)) {
            setIsValidUserName(false);
            setValidateMessage(t("register:invalidUsername"));
            return;
        }

        const response = await createNickname(session, name, selectedAvatarId);
        const authorizeResponse = response as AuthorizeResponse;
        if (authorizeResponse && authorizeResponse.authorized) {
            handleStateLogin(authorizeResponse);
        } else {
            setValidateMessage(t(GetLocalizedErrorMessage((response as Response).errorCode)));
            setIsValidUserName(false);
        }
    };

    const generateName = (event) => {
        event.preventDefault();
        setIsValidUserName(true);
        updateNameState(NameGenerator.generateName);
    };

    const validateUsername = (username: string) => {
        const regex = new RegExp("^[a-zA-Z0-9]+$");
        return username.length > 14 || username.length < 3 || username.match(regex) === null;
    };

    const onChangeUserName = (event) => {
        event.preventDefault();
        updateNameState(event.target.value);
    };

    const clearUserName = () => {
        updateNameState("");
        setIsValidUserName(true);
    };

    return (
        <div className={Styles["wrapper"]}>
            <div className={Styles["page-bg"]}>
                <div className={Styles["page-container"]}>
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                    </div>
                    <div className={Styles["wrapper-welcome"]}>
                        <div className={Styles["welcome"]}>
                            <Trans t={t}>{t("register:registerTitle1", { sabaMobileName: sabaMobileName })}</Trans>
                        </div>
                        <div className={Styles["welcome"]}>
                            <Trans t={t}>
                                {t("register:registerTitle2", { sabaMobileName: sabaMobileName, sabaClubName: sabaClubName })}
                            </Trans>
                        </div>
                        <div className={Styles["welcome"]}>
                            <Trans t={t}>{t("register:registerTitle3", { sabaClubName: sabaClubName })}</Trans>
                        </div>
                    </div>
                    <ProfilePicture avatarId={selectedAvatarId} />
                    <form className={Styles["login-form"]} onSubmit={(event) => handleSubmit(event)}>
                        <label className={Styles["input-title"]}>{t("register:registerName")}</label>
                        <div className={Styles["user-box"]}>
                            <div className={Styles["register-wrapper-input"]}>
                                <input
                                    type="text"
                                    className={Styles["custom-form-control"]}
                                    value={name}
                                    onChange={(event) => onChangeUserName(event)}
                                />
                                <span className={`icon-close ${Styles["icon-remove"]}`} onClick={() => clearUserName()}></span>
                            </div>

                            <button
                                className={`${Styles["btn-green"]} ${Styles["btn-refresh"]}`}
                                onClick={(event) => generateName(event)}
                                type="button"
                            >
                                <span className="icon-refresh"></span>
                            </button>
                        </div>
                        {!isValidUserName && <label className={Styles["message-error"]}>{validateMessage}</label>}

                        <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`} type="submit">
                            {t("common:enterGameBtn")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
