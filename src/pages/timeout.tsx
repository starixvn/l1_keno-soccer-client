import React from "react";

const Timeout = () => {
    return (
        <div className="error-page">
            <img alt="SessionTimeout" className="error-background" src={`/static/images/error-session-dark.svg`} />
            <p className="session-timeout-title">
                Phiên đăng nhập của bạn đã hết hạn, hoặc bạn chưa có đăng nhập. <br /> Vui lòng đóng cửa sổ game và thử đăng nhập lại.
            </p>
            <p>
                Your session has timed out or you have not logged in yet. <br /> Please close the current windows and try to login again.
            </p>
        </div>
    );
};

export default Timeout;
