import styled from 'styled-components'

export const SideBarContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-right: 2px;
    padding-left: 4px;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.2s;
`

export const SideBarWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    user-select: none;
    overflow-y: overlay;
    padding: 1vw;

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

export const Title = styled.div`
    font-size: 22px;
    line-height: 22px;
    color: #bbb;
    
    @media screen and (max-width: 1500px) { 
        font-size: 18px;
    }
`

export const Description = styled.div`
    font-size: 18px;
    color: #777;
    
    @media screen and (max-width: 1500px) { 
        font-size: 16px;
    }
`

export const Notice = styled.div`
    font-size: 18px;
    padding: 1em;
    color: #9a9a9a;
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
    cursor: default;
    font-weight: 300;
    display: inline-block;
    vertical-align: top;
    user-select: text;
`

export const DashboardContent = styled.div`
    width: 100%;
    height: 100%;
`

//Folders UI


export const FolderContainer = styled.div`
    width: 6.8vw;
    margin: 1vw;
    position: relative;
    display: inline-block;
    vertical-align: top;
`

export const FolderWrapper = styled.div`
    height: 6.8vw;
    width: 6.8vw;
    border-radius: 20px;
    background-color: ${({backColor}) => (backColor)};
    outline-offset: -0px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    padding: 0.46vw;

    &:hover {
        outline: 2px solid #888;
    }
`

export const FaviconWrapper = styled.img`
    width: 30px;
    height: 30px;
    padding: 5px;
    margin: 6px;
    object-fit: cover;
    object-position: left;
    border: 1px solid #eee;
    position: absolute;
    background-color: #f0f0f0;
    border-radius: 12px;
`

export const FolderIconContainer = styled.div`
    width: 2.5vw;
    height: 2.5vw;
    margin: 0.22vw;
    object-fit: cover;
    object-position: left;
    background-color: ${({folderColor}) => (folderColor)};
    border-radius: 12px;
    opacity: 1;
    display: inline-block;
`

export const FolderFaviconContainer = styled(FolderIconContainer)`
    background-color: ${({folderColor}) => (folderColor)}44;
    
    ${FolderWrapper}:hover & {
        outline: 6px solid #00000033;
        outline-offset: -6px;
    }
`

export const FolderIconWrapper = styled.div`
    margin: auto;
    width: 2.5vw;
    height: 2.5vw;
    cursor: pointer;
    text-decoration: none;
    display: block;
    text-align: center;
`

export const LetterIcon = styled.div`
    margin: auto;
    color: #0482ff;
    font-size: 1.5vw;
    line-height: 2.3vw;
    font-weight: 800;
    display: inline-block;
    vertical-align: top;
    color: ${({letterColor}) => (letterColor)};

`

export const SmallFolderIconContainer = styled.div`
    width: 1.52vw;
    height: 1.52vw;
    margin: 0.22vw;
    object-fit: cover;
    object-position: left;
    background-color: ${({folderColor}) => (folderColor)}dd;
    border-radius: 9px;
    opacity: 1;
    display: inline-block;
`

export const SmallFolderIconWrapper = styled.div`
    margin: auto;
    width: 1.52vw;
    height: 1.52vw;
    cursor: pointer;
    text-decoration: none;
    display: block;
    text-align: center;
`

export const SmallLetterIcon = styled.div`
    margin: auto;
    color: #0003;
    font-size: 0.95vw;
    line-height: 1.4vw;
    font-weight: 800;
    display: inline-block;
    vertical-align: top;
`

export const SideSpacer = styled.div`
    width: 50%;
    height: 100px;
    object-fit: cover;
    object-position: left; 
    opacity: 0.75;
    display: inline-block;
`

export const FolderImage = styled.img`
    width: 16.66%;
    height: 100px;
    object-fit: cover;
    object-position: left;
    outline: 1px solid #111;  
    opacity: 0.75;
    
    ${FolderWrapper}:hover & {
        height: 110px;
        opacity: 1;
    }
    
    @media screen and (max-width: 1500px) { 
        height: 80px;
    } 
`

//Search

export const SearchBar = styled.form`
    bottom: 0;
    width: 100%;
    height: 62px;
    position: absolute;
    border-top: 1px solid #555;
    overflow: hidden;
    
    @media screen and (max-width: 1500px) { 
        height: 54px;
    }
`;

export const SearchInput = styled.input`
    padding: 11px 0px 11px 10px;
    margin-top: 10px;
    font-size: 18px;
    outline: none;
    border: none;
    width: 80%;
    display: inline-block;
    background: #222;
    color: #000;
    position: absolute;

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
    }

    &::placeholder {
        color: #666;
    }
    
    @media screen and (max-width: 1500px) { 
        margin-top: 5px;
    }
`;

export const SearchButton = styled.div`
    height: 42px;
    width: 36px;
    padding: 18px 0px 8px 12px;
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.75);
    font-size: 1.2rem;
    outline: none;
    border: none;
    display: inline-block;
    border-right: 1px solid #555;
    cursor: pointer;

    &:hover {
        opacity: 0.5;
    }

    @media screen and (max-width: 1500px) { 
        padding: 14px 0px 8px 12px;
    }
`;

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
`

export const SpacerSmall = styled.div`
    display: block;
    bottom: 0;
    height: 3rem;
    width: 100%;
`

export const SpacerMedium = styled.div`
    display: block;
    bottom: 0;
    height: 120px;
    width: 100%;
`

export const PageEncase = styled.img`
    width: 6.8vw;
    padding: 0vw;
    margin: -0.45vw;
    position: absolute;
    opacity: 0.6;
`