import styled from 'styled-components'

export const BookmarksContainer = styled.div`
    width: 76.80%;
    height: 100vh;
    position: absolute;
    right: 0;
    z-index: 99906;
    
    @media screen and (max-width: 1500px) { 
        width: 75.25%;
        padding-right: 1px;
    }

    @media screen and (max-width: 960px) {
        width: 100%;
    }
`

export const BookmarksWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #111;
    overflow: scroll;
    overflow-x: hidden;
`

export const TopBar = styled.div`
    width: 35%;
    height: 48px;
    border-bottom: 1px solid #555;
    border-right: 1px solid #555;
    padding: 1em;
    position: sticky;
    top: 0;
    background-color: #111;
    z-index: 999;
    
    @media screen and (max-width: 1500px) { 
        width: 50%;
    }

    @media screen and (max-width: 960px) {
        width: 100%;
    }
`

export const SelectedDescription = styled.div`
    margin-left: 63px;
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
//Folders UI

export const WebsiteCardsContainer = styled.div`
    display: grid;
    margin: 1.8rem;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    grid-gap: 2rem;
    
    @media screen and (max-width: 1500px) { 
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    }

    @media screen and (max-width: 960px) {
        grid-gap: 0.25rem;
        grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    }
`

export const WebsiteCard = styled.div`
    height: 230px;
    display: inline-block;
    
    @media screen and (max-width: 960px) {
        height: 115px;
    }
`

export const Name = styled.h5`
    color: #888;
    font-size: 14px;
    margin-top: 0px;
    padding: 0px 16px;
    cursor: default;
    font-weight: 300;
`

export const WebsiteContainer = styled.div`
    width: 100%;
    height: 200px;
    border-radius: 20px;
    background-color: #111;
    border: 1px solid #555;
    overflow: hidden;
    display: inline-block;
    cursor: pointer;
    transition: 0.1s;

    &:hover {
        border: 1px solid #555;
        outline: 4px solid #555;
    }

    @media screen and (max-width: 960px) {
        height: 100px;

        &:hover {
            outline: 0px solid #bbb;
            border: 1px solid #eee;
        }
    }
`

export const WebsiteWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
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
    z-index: 99999999;
`

export const FolderIconContainer = styled.div`
    width: 36px;
    height: 36px;
    padding: 5px;
    margin-top: -1px;
    object-fit: cover;
    object-position: left;
    border: 1px solid #555;
    position: absolute;
    background-color: #89ee46;
    border-radius: 12px;
`

export const FolderIconWrapper = styled.div`
    margin: 3px;
    padding-left: px;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    vertical-align: center;
`

export const WebsiteImage = styled.img`
    height: 200px;
    object-fit: cover;
    object-position: left; 
    transition: 0.2s;
    opacity: 0.9;
  
    
    ${WebsiteContainer}:hover & {
        height: 210px;
    }

    @media screen and (max-width: 960px) {
        height: 140px;  
        
        ${WebsiteContainer}:hover & {
            height: 140px;
        }
    }
`

////Search
////Search

export const SearchBar = styled.form`
    bottom: 0;
    width: 35%;
    height: 62px;
    position: absolute;
    border-top: 1px solid #555;
    background-color: #111;
    border-right: 1px solid #555;
    overflow: hidden;

    @media screen and (max-width: 1500px) { 
        width: 40%;
        height: 54px;
    }

    @media screen and (max-width: 960px) {
        width: 100%;
    }
`;

export const SearchInput = styled.input`
    padding: 11px 0px 11px 10px;
    margin-top: 10px;
    font-size: 18px;
    outline: none;
    border: none;
    width: 84%;
    display: inline-block;
    background-color: #111;
    transition: all 0.2s ease-in-out;
    color: #000;
    position: absolute;

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
    }

    &::placeholder {
        color: #555;
    }
    
    @media screen and (max-width: 1500px) { 
        margin-top: 5px;
    }
`;

export const SearchButton = styled.div`
    height: 42px;
    width: 36px;
    padding: 18px 0px 8px 12px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
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
        height: 43px;
        padding: 14px 0px 8px 12px;
    }
`;

export const SpacerMedium = styled.div`
    display: block;
    bottom: 0;
    height: 120px;
    width: 100%;
`