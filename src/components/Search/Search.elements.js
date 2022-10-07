import styled from 'styled-components'

export const SearchContainer = styled.div`
    height: 50px;
    width: 100%;
    transition: 0.2s;
    position: absolute;
    text-align: center;
    z-index: 9999999999999999;
    top: 100px;
`

export const TextContainer = styled.div`
    width: 88px;
    height: 42px;
    display: inline-block;
    text-align: center;
`

export const IconWrap = styled.span`
    margin-top: 8px;
    margin-right: 25px;
    position: absolute;
    right: 0;
    z-index: 9999; 
    cursor: pointer;

    &:hover {
        opacity: 0.75;
    }
`

export const SearchBar = styled.form`
    top: 20px;
    position: absolute;
    z-index: 3;
    transition: 0.2s ease-in-out;
    animation-delay: 0.1s;
    top: ${({active}) => (active ? '20px' : '0')};
    margin-left: ${({active}) => (active ? '-10.5vw' : '1vw')};
    width: ${({active}) => (active ? '25%' : '4%')};
`

export const SearchInput = styled.input`
    padding: 11px 0px 11px 10px;
    font-size: 17px;
    outline: none;
    border: none;
    border-radius: 1.2rem;
    float: left;
    background: rgba(255,255,255,0.2);
    color: #909090;
    width: 100%;
    opacity: ${({active}) => (active ? '1' : '0.5')};
    pointer-events: ${({active}) => (active ? '' : 'none')};

    &:focus {
        background: rgba(195,195,195,1);
        color: #757575;
        outline: rgba(255,255,255,0.5) 2px solid;
    }

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
        -webkit-appearance: none;
        appearance: none;
    }

    &::placeholder {
        color: #8a8a8a;
    }
`