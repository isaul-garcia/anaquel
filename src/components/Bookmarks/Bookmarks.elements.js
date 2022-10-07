import styled from 'styled-components'
import { ReactSortable } from "react-sortablejs";

export const BookmarksTrayContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-right: 2px;
    position: absolute;
    background-color: #111;
    overflow: hidden;
    right: 0;
    top: 0;
`

export const BookmarksTrayWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    user-select: none;    
    overflow-y: ${({ expand }) => (expand ? 'overlay' : 'hidden')};

    /* width */
    &::-webkit-scrollbar {
        width: 6px;    
        cursor: pointer;
    }

    /* width */
    &::-webkit-scrollbar:hover {
        width: 16px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        margin: 20px;
        margin-top: 4.25em;
        border-radius: 20px;
        cursor: pointer;
    }
    
    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: #555; 
        border-radius: 20px;
        cursor: pointer;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: #333;   
        cursor: pointer;
        width: 10px;
    }
`

export const Notice = styled.div`
    font-size: 18px;
    padding: 1em;
    color: #9a9a9a;
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
    position: fixed;
    z-index: 3;
    pointer-events: none;
    transition: 0.2s;
    margin-top: ${({ expand }) => (expand ? '0' : '-70px')};
`

//Folders UI
//Folders UI
//Folders UI
//Folders UI
//Folders UI

export const customReactSortable = styled(ReactSortable)`
    margin: 1.5vw;
`

export const WebsiteCard = styled.div`
    height: 9rem;
    width: 6.5rem;
    margin: 1vw;
    display: inline-block;
    
    @media screen and (max-width: 1500px) { 
        height: 6.5rem;
        width: 4.8rem;
    }
`

export const WebsiteApp = styled.div`
    height: 6.5rem;
    padding-left: 0.9rem;
    border-radius: 20px;
    background-color: #222;
    /* outline: 5px solid #111;
    outline-offset: -4px;
    margin-left: -4px; */
`


export const WebsiteContainer = styled.div`
    width: 100%;
    height: 6.5rem;
    display: inline-block;
    cursor: pointer;
    position: relative;
    outline: 4px solid #111;
    border-radius: 20px;

    @media screen and (max-width: 1500px) { 
        height: 4.8rem;
    }
`

export const NameContainer = styled.div`
    height: 30px;
    width: 100%;
    overflow: hidden;
`

export const NameWrapper = styled.div`
    height: 30px;
    width: 100vw;
`

export const Name = styled.h5`
    color: #888;
    font-size: 14px;
    line-height: 26px;
    margin-top: 0px;
    cursor: pointer;
    font-weight: 300;
    display: inline-block;
    vertical-align: top;
    user-select: text;
`

export const IPFS = styled.div`
    width: 4px;
    height: 4px;
    padding: 3px;
    margin-right: 4px;
    margin-left: 1px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 10px;
    z-index: 2;
    display: ${({ isIPFS }) => (isIPFS ? '' : 'none')};
    outline: ${({ isPinned }) => (isPinned ? '4px solid #69c4cd' : '1px solid #69c4cd')};
    outline-offset: ${({ isPinned }) => (isPinned ? '-4px' : '-1px solid #69c4cd')};
`

export const Pinned = styled.span`
    font-size: 8px;
    height: 18px;
    padding: 2px 4px;
    margin-right: 2px;
    background-color: #242f40;
    border-radius: 12px;
    z-index: 2;
    display: ${({ isIPFS }) => (isIPFS ? '' : 'none')};
`

export const WebsiteWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #333;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: 2px solid #8880;
  
  ${WebsiteCard}:hover & {
    background-color: #222;
    border: 2px solid #888;
  }

  ${WebsiteCard}:active & {
    border: 2px solid #028ef7;
  }
`

export const WebsiteImage = styled.img`
    height: 100%;
    overflow: hidden;
    object-fit: cover;
    object-position: center; 
    opacity: 0.9;
    padding: 4px;
    border-radius: 1.15em;
`

export const SpacerXSmall = styled.div`
    display: block;
    bottom: 0;
    height: 3.8em;
    width: 100%;
    transition: 0.2s;
    height: ${({ expand }) => (expand ? '3.8em' : '0')};
`

export const Separator = styled.div`
    display: block;
    bottom: 0;
    height: 0;
    width: 100%;
    border-bottom: 1px #555 solid;
`