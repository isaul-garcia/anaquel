import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const FooterContainer = styled.div`
    width: 100%;
    height: 3em;
    position: absolute;
    bottom: 0;
    pointer-events: none;
`

export const FooterWrapper = styled.div`
    width: 100%;
    height: 100%;
    vertical-align: top;
    pointer-events: none;
`

export const TextContainer = styled.div`
    margin: 0 1.5em;
    cursor: pointer;
    position: relative;
    text-decoration: none;
    pointer-events: all;
    transition: all .2s ease-in-out;
    display: inline-block;
    vertical-align: center;
    pointer-events: none;
`

export const TextContainerRight = styled(TextContainer)`
    float: right;
`

export const TextWrapper = styled(Link)`
    font-weight: 300;
    font-size: 0.8em;
    color: #333;
    width: 100%;
    text-align: center;
    line-height: 48px;
    vertical-align: center;
    text-decoration: none;
    pointer-events: all;

    &:hover{
        color: #666;
    }
`