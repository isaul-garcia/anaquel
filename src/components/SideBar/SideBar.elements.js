import styled from 'styled-components'

export const SideBarContainer = styled.div`
    width: 20%;
    height: 100vh;
    margin-left: 60px;
    position: absolute;
    z-index: 99907;

    @media screen and (max-width: 960px) {
        width: 100%;
        margin-left: ${({reveal}) => (reveal ? '-100%' : '0')};
    }
`

export const SideBarWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #222;
    border-right: 1px solid #555;

    @media screen and (max-width: 960px) {
        border-right: 1px solid #555;
    }
`

export const TopBar = styled.div`
    border-bottom: 1px solid #555;
    padding: 1em;
    height: 48px;
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

export const DashboardContent = styled.div`
    width: 100%;
    height: 100%;
`

//Folders UI

export const FolderContainer = styled.div`
    width: 100%;
    position: relative;
    display: inline-block;
    
    @media screen and (max-width: 960px) { 
        width: 50%;
        display: inline-block;
    }
`

export const FolderWrapper = styled.div`
    margin: 12px;
    margin: 1.8rem;
    margin-bottom: -10px;
    height: 100px;
    border-radius: 20px;
    background-color: #111;
    outline: 1px solid #888;
    outline-offset: -0px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.1s;
    position: relative;

    &:hover {
        outline: 2px solid #888;
    }
    
    @media screen and (max-width: 1500px) { 
        height: 80px;
    }

    @media screen and (max-width: 960px) { 
        display: inline-block;
        outline: 0px solid #888;
        
        &:hover {
            outline: 0px solid #888;
        }
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
    width: 65px;
    height: 65px;
    padding: 4px;
    margin: 13px;
    object-fit: cover;
    object-position: left;
    outline: 1px solid #00000033;
    outline-offset: -1px;
    position: absolute;
    background-color: ${({folderColor}) => (folderColor)};
    border-radius: 12px;
    transition: 0.1s;
    opacity: 1;
    z-index: 999999999999999999999999;
    
    ${FolderWrapper}:hover & {
        outline: 4px solid #00000033;
        outline-offset: -4px;
    }
    
    @media screen and (max-width: 1500px) { 
        height: 57px;
        width: 57px;
    }
    
    @media screen and (max-width: 1500px) { 
        outline: 0px solid #00000033;
        outline-offset: 0px;
        
        ${FolderWrapper}:hover & {
        outline: 0px solid #00000033;
        outline-offset: 0px;
    }
    } 
`

export const FolderIconWrapper = styled.div`
    margin: auto;
    width: 100%;
    height: 100%;
    margin: 12px;
    justify-content: center;
    align-items: center;
    vertical-align: center;
    opacity: 1;
    
    @media screen and (max-width: 1500px) { 
        margin: 8px;
    }
`

export const SideSpacer = styled.div`
    width: 50%;
    height: 100px;
    object-fit: cover;
    object-position: left; 
    transition: 0.2s;
    opacity: 0.75;
    display: inline-block;
`

export const FolderImage = styled.img`
    width: 16.66%;
    height: 100px;
    object-fit: cover;
    object-position: left;
    outline: 1px solid #888;   
    transition: 0.2s;
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
    transition: all 0.2s ease-in-out;
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
    transition: all 0.2s ease-in-out;
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