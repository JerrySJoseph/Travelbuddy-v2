// import { createGetInitialProps } from '@mantine/next';
// import Document, { Head, Html, Main, NextScript } from 'next/document';

// const _getInitialProps = createGetInitialProps();

// export default class _Document extends Document {
//   static getInitialProps = _getInitialProps;

//   render() {
//     return (
//       <Html>
//         <Head />
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

import Document, { DocumentContext } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';
import {resetServerContext} from 'react-beautiful-dnd'

// optional: you can provide your cache as a fist argument in createStylesServer function
const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    resetServerContext();

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
      ],
    };
  }
}