import {createGlobalStyle} from 'styled-components'
// import styled from 'styled-components/macro'

const GlobalStyle = createGlobalStyle`

    *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }    

    body {
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #141415;
        font-family: Shippori Antique, Arial, Helvetica, sans-serif;
        letter-spacing: -0.025em;
        overflow: hidden;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 10px;    
    }

    /* Track */
    ::-webkit-scrollbar-track {
        margin: 10px;
        border-radius: 20px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888; 
        border-radius: 20px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;   
    }
`

export default GlobalStyle