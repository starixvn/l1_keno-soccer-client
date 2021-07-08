import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Navbar } from "reactstrap";
import { User } from "sc-user-service-client/dist/auth";

import { numberWithCommas } from "../../helpers/number-helper";
import Styles from "./header.module.scss";

type Props = {
    user: User;
};

const Header: React.FC<Props> = ({ user }) => {
    const { locale } = useRouter();

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <a href={`/${locale}`} className={Styles["site-name"]}>
                            Keno Soccer
                        </a>
                        <div className="d-flex align-items-center">
                            <div className={Styles["user"]}>
                                <div className={Styles["info"]}>
                                    <div className={Styles["user-name"]}>{user.name}</div>
                                    <div className={`${Styles.balance}`}>
                                        {numberWithCommas(user.red ?? 0)} {user.currency}
                                    </div>
                                </div>
                                <Avatar avatarId={user.avatarId} />
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

function Avatar({ avatarId }) {
    return (
        <div className={Styles["avatar"]}>
            {avatarId > 0 && avatarId < 41 ? (
                <img src={`/static/images/avatar/${avatarId}.png`} className="img-fluid" alt="Avatar" />
            ) : (
                <span className={`icon-user ${Styles["icon-user"]}`}></span>
            )}
        </div>
    );
}

export default Header;
