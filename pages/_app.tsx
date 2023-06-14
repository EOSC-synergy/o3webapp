import { wrapper } from '../src/store';
import '../styles/main.css';
import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>O3AS Webapp</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default wrapper.withRedux(MyApp);
