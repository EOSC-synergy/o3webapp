import { wrapper } from '../src/store/store';
import '../styles/main.css';
import React from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>O3AS Webapp</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <React.StrictMode>
                <Component {...pageProps} />
            </React.StrictMode>
        </>
    );
}

export default wrapper.withRedux(MyApp);
