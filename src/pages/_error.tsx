import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent from "next/error";

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
    if (!hasGetInitialPropsRun && err) {
        Sentry.captureException(err);
    }

    return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async (context: NextPageContext) => {
    const initialProps = await NextErrorComponent.getInitialProps(context);

    const errorInitialProps = {
        ...initialProps,
        hasGetInitialPropsRun: true,
    };

    context.err
        ? Sentry.captureException(context.err)
        : Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${context.asPath}`));

    await Sentry.flush(2000);

    return errorInitialProps;
};

export default MyError;
