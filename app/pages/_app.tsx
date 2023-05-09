import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import getDefaultTheme from '../Utils/mantineTheme';
import { useEffect, useState } from 'react';
import '../styles/globals.css'
import '../firebase/init'
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { app } from '../firebase/init'
import { AuthContextProvider } from 'data/context/auth-context';
import AppContextProvider from 'data/context/app-context';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  // useEffect(() => {
  //   if (window.location.hostname == 'localhost') {
  //     connectFunctionsEmulator(getFunctions(app), 'localhost', 5001)
  //     connectAuthEmulator(getAuth(app), "http://localhost:9099");
  //   }
  // }, [])

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
      </Head>
      <Script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js' integrity='sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V' crossOrigin='anonymous' defer />
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...getDefaultTheme(),
            colorScheme
          }}
        >
          <AppContextProvider>
            <AuthContextProvider>
              <Component {...pageProps} />
            </AuthContextProvider>
          </AppContextProvider>

        </MantineProvider>
      </ColorSchemeProvider>

    </>
  );
}
