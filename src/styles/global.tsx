import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
 :root {
    --background: #20232A;
    --branding-default-blue: #3A5F9B;
    --branding-dark-blue: #2A457A;
    --branding-default-red: #94191D;
    --gray: #DEE1E6;
    --shape: #3D3E43;

    --status-success-100: #D1FADF;
    --status-success-500: #12B76A;
    --status-success-950: #05603A;

    --status-warning-500: #FDB022;

    --status-error-100: #FEE4E2;
    --status-error-950: #912018;

    --text-black: #000000;
    --text-gray: #757575;
    --text-purple-light: #64607D;
    --text-purple-dark: #16012C;

    --neutral-black: #000000;
    --neutral-white: #FFFFFF;
    --neutral-50: #FAFAFA;
    --neutral-100: #F9F9F9;
    --neutral-200: #E4E7EC;
    --neutral-300: #D0D5DD;
    --neutral-400: #98A2B3;
    --neutral-500: #667085;
    --neutral-800: #1D2939;

    --fontWeightRegular: 400;
    --fontWeightMedium: 500;
    --fontWeightSemiBold: 600;
    --fontWeightBold: 700;
    --fontWeightExtraBold: 800;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  html {
    @media (max-width: 1080px) {
      font-size: 93.75%; 
    }

    @media (max-width: 720px) {
      font-size: 87.5%;
    }
  }
`;
