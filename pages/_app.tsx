import React from 'react';
import {AppProps} from 'next/app';
import {createGlobalStyle, ThemeProvider, DefaultTheme} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: #161616;
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
`;

const theme: DefaultTheme = {
  colors: {
    primary: '#0070f3',
    border: '#eaeaea',
  },
};

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
