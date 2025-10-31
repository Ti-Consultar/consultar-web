import { createGlobalStyle } from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    --status-error-950: #fc0f0f;

    --text-black: #000000;
    --text-gray: #757575;
    --text-purple-light: #64607D;
    --text-purple-dark: #16012C;

    --neutral-black: #000000;
    --neutral-white: #FFFFFF;
    --neutral-50: #F6F8FA;
    --neutral-100: #F9F9F9;
    --neutral-150: #efefef;
    --neutral-200: #E4E7EC;
    --neutral-300: #D0D5DD;
    --neutral-400: #98A2B3;
    --neutral-500: #667085;
    --neutral-600: #586173;
    --neutral-700: #1a1d23;
    --neutral-800: #1D2939;

    --fontWeightRegular: 400;
    --fontWeightMedium: 500;
    --fontWeightSemiBold: 600;
    --fontWeightBold: 700;
    --fontWeightExtraBold: 800;

    --button-primary: #3A5F9B;
    --button-primary-hover:rgb(31, 63, 114);
    --button-secondary: #EAEAEC;
    --button-secondary-hover: #cecece;
    --button-tertiary: #e2e2e2;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Mona Sans', sans-serif;
  }
  
  html {
    @media (max-width: 1080px) {
      font-size: 93.75%; 
    }

    @media (max-width: 720px) {
      font-size: 87.5%;
    }
  }

  .custom-node .react-flow__handle {
  display: none;
}

.loader {
  height: 20px; 
  aspect-ratio: 2.5;
  --dot-color: #9e9e9e;
  --_g: no-repeat radial-gradient(farthest-side, var(--dot-color) 90%, #0000);
  background: var(--_g), var(--_g), var(--_g), var(--_g);
  background-size: 15% 40%; /* dots menores */
  animation: l43 1s infinite linear;
}

@keyframes l43 {
  0%     {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  16.67% {background-position: calc(0*100%/3) 0   ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  33.33% {background-position: calc(0*100%/3) 100%,calc(1*100%/3) 0   ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  50%    {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 100%,calc(2*100%/3) 0   ,calc(3*100%/3) 50% }
  66.67% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 100%,calc(3*100%/3) 0   }
  83.33% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 100%}
  100%   {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
}
`;
