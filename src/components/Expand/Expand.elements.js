import styled from 'styled-components'

export const ExpandContainer = styled.div`
    width: 100%;
    height: ${({expand}) => (expand ? '7.5vh' : '21vh')};
    transition: 0.2s;
    position: absolute;
    bottom: 0;
    text-align: center;
`

export const TextContainer = styled.div`
    width: 88px;
    height: 22px;
    cursor: pointer;
    text-decoration: none;
    border-radius: 50px;
    display: inline-block;
    background-color: #222;
    text-align: center;
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
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
`