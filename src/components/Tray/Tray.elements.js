import styled from 'styled-components'

export const Container = styled.div`
    transition: 0.2s;
    margin-left: ${({expand}) => (expand ? '16vw' : '26.2vw')};
    margin-top: ${({expand}) => (expand ? '10.5vh' : '20vh')};
    width: ${({expand}) => (expand ? '68vw' : '47.6vw')};
    height: ${({expand}) => (expand ? '78.5vh' : '58vh')};
    position: absolute;
    z-index: 999999999999;
    
    @media screen and (max-width: 1500px) { 
        height: ${({expand}) => (expand ? '78.5vh' : '55.75vh')};
    }
`

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 1.25rem;
    position: relative;
    overflow: hidden;
    outline: #2d2d31 solid 1px;
    background-color: #111;
`

export const FolderTrayContainer = styled.div`
    width: ${({expand}) => (expand ? '20.4vw' : '20.4vw')};
    margin-left: ${({expand}) => (expand ? '0' : '-20.4vw')};
    height: 100%;
    position: relative;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    background-color: #29292c;
    transition: 0.2s;
`

export const FolderTrayWrapper = styled.div`
    margin: 0;
`

export const MarksTrayContainer = styled.div`
    width: 47.6vw;
    height: 100%;
    display: inline-block;
    position: relative;
    vertical-align: top;
`

export const MarksTrayWrapper = styled.div`
    padding: 0rem;
`

export const SearchBack = styled.div`
    font-size: 18px;
    width: 20.4vw;
    line-height: 24px;
    border-radius: 1.25rem 0 0 0;
    padding: 0.9em 1.5em 1.25vw 1.5em;
    color: #9a9a9a00;
    border-bottom: 1px solid #29292cdd;
    background-color: #29292ccc;
    position: fixed;
    z-index: 2;
    transition: 0.2s;
    position: absolute;
    margin-left: ${({expand}) => (expand ? '0' : '-20.4vw')};
`

export const SearchBar = styled.form`
    margin: 0.80% 0.75%;
    position: absolute;
    width: 28.5%;
    z-index: 3;
    transition: 0.2s;
    margin-left: ${({expand}) => (expand ? '0.75%' : '-20.4vw')};
`

export const SearchInput = styled.input`
    padding: 11px 0px 11px 10px;
    font-size: 17px;
    outline: none;
    border: none;
    border-radius: 0.75rem;
    float: left;
    background: rgba(255,255,255,0.2);
    color: #909090;
    width: 100%;

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

export const SpacerSmall = styled.div`
    display: block;
    bottom: 0;
    height: 3em;
    width: 100%;
`

export const SpacerMedium = styled.div`
    display: block;
    bottom: 0;
    height: 120px;
    width: 100%;
`



export const TrayName = styled.div`
    font-size: 18px;
    width: 47.6vw;
    line-height: 24px;
    padding: 0.9em 1.5em 1.25vw 1.5em;
    border-radius: 0 1.25rem 0 0;
    color: #9a9a9a;
    border-bottom: 1px solid #2d2d31;
    background-color: #111111dd;
    position: absolute;
    z-index: 3;
    pointer-events: none;
    transition: 0.2s;
    margin-top: ${({expand}) => (expand ? '0' : '-70px')};
`