import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="/O3asWepAppIcon.ico" />
                    <meta name="theme-color" content="#000000" />
                    <meta name="description" content="O3AS Webapp" />
                    {/*<link rel="apple-touch-icon" href="/logo192.png"/>*/}
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
