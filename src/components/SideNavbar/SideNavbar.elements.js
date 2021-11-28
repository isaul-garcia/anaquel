import styled from 'styled-components'

export const NavbarContainer = styled.div`
    width: 3.75em;
    height: 100vh;
    position: absolute;
    left: -1px;
    z-index: 99909;
    background-color: #111;

    @media screen and (min-width: 961px) {
        top: 0;
    }

    @media screen and (max-width: 960px) {
        width: 100vw;
        height: 76px;
        bottom: 0;
        overflow: hidden;
    }
`

export const NavbarWrapper = styled.div`
    width: 100%;
    height: 100%;
    border-right: 1px solid #555;
    margin: auto;
    position: relative;
`

export const NavLogoWrapper = styled.div`
    height: 80px;
    width: 100%;
    overflow: hidden;
    position: relative;
    display: block;
    border-bottom: 1px solid #555;
    padding-left: 1px;
    
    @media screen and (max-width: 960px) {
        border-top: 1px solid #555;
        position: absolute;
        background-color: #111;
    }
`

export const NavLogoShort = styled.img`
    object-fit: contain;
    transition: 0.3s;
    position: absolute;
    height: 52px;
    padding: 20px;
    opacity: 1; 
    background-color: #111;
    margin-top: -5px;
    cursor: pointer;
    
    @media screen and (max-width: 960px) {
        height: 34px;
        padding: 10px 26px 10px 20px;
        margin: 10px;
        display: inline-block;
        border-right: 1px solid #555;
    }
`

export const NavItemsWrapper = styled.span`
    width: 100%;
    position: absolute;
    margin-top: 8px;
    padding-left: 1px;
    
    @media screen and (max-width: 960px) {
        margin-left: 80px;
        margin-top: 7px;
    }
`

export const NavItemsWrapperBottom = styled(NavItemsWrapper)`
    bottom: 0;
    
    @media screen and (max-width: 960px) {
        display: none;
    }
`

export const NavItem = styled.a`
    width: 60%;
    padding: 11px;
    display: ${({forMobile}) => (forMobile ? 'none' : 'inline-block')};
    
    @media screen and (max-width: 960px) {
        width: 50px;
        display: inline-block;
    }
`

export const LinkText = styled.a`
    font-size: 20px;
    font-weight: 500;
    color: #f0f0f0;
    cursor: pointer;
    vertical-align: top;
`

export const NavLinkIcon = styled.a`
    line-height: 20px;
    padding: 0px 9px 2px 9px;
    border-radius: 50px;
    background-color: #444;
    color: #f0f0f0;
    cursor: pointer;
    font-size: 22px;
    transition: 0.15s;

    &:hover {
        background-color: #252525;
    }
    
    @media screen and (max-width: 960px) {
        line-height: 40px;
        padding: 10px 19px 12px 19px;
    }
`

export const Popover = styled.h5`
    width: 120px;
    height: 26px;
    line-height: 24px;
    font-weight: 300;
    font-size: 16px;
    background-color: #000;
    outline: 1px solid #333;
    color: #f0f0f0;
    padding: 2px 12px;
    position: absolute;
    margin-left: 52px;
    z-index: 999;
    border-radius: 12px;
    margin-top: -29px;
    transition: 0.2s;
    opacity: 0;
    pointer-events: none;

    ${NavLinkIcon}:hover & {
        opacity: 1;
    }
    
    @media screen and (max-width: 960px) {
        display: none;
    }
`