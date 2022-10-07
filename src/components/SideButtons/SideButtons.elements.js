import styled from 'styled-components'

export const ExpandContainer = styled.div`
    width: 100%;
    height: 4.5em;
    position: absolute;
    bottom: 0;
    text-align: center;
`

export const TextContainer = styled.div`
    width: 80px;
    height: 22px;
    cursor: pointer;
    text-decoration: none;
    border-radius: 50px;
    display: inline-block;
    background-color: #222;
    text-align: center;
    margin-left: -40px;
    z-index: 3;

    &:hover {
        background-color: #1e1e1e;
    }
`

export const TextWrapper = styled.h5`
    font-weight: 200;
    font-size: 0.8em;
    color: #787878;
    line-height: 20px;
    cursor: pointer;
`


export const UIContainer = styled.div`
    width: 16%;
    height: 100%;
    position: absolute;
    text-align: center;
    margin-top: 44vh;
    transition: 0.2s;
    opacity: ${({expand}) => (expand ? 1 : 0)};
    margin-left: ${({expand}) => (expand ? '0' : '2em')};
    margin-right: ${({expand}) => (expand ? '0' : '2em')};

    ${({isRight}) => (isRight ? 'right:0;' : '')};
`

export const ButtonContainer = styled.div`
    width: 100%;
    height: 33px;
    cursor: pointer;
    text-decoration: none;
    display: block;
    text-align: center;
    margin-bottom: 1em;
`

export const ButtonWrapper = styled.div`
    width: 34px;
    height: 34px;
    background-color: aliceblue;
    padding-right: 0px;
    margin: auto;
    font-weight: 200;
    font-size: 1em;
    line-height: 2.375em;
    color: #787878;
    cursor: pointer;
    background-color: #333;
    border-radius: 50px;

    &:hover {
        background-color: #2a2a2a;
    }
`

