import styled from 'styled-components'

export const NavbarContainer = styled.div`
    width: 100%;
    height: 80px;
    position: sticky;
    top: 0;
`

export const NavbarWrapper = styled.div`
    width: 90%;
    height: 80px;
    border-bottom: 1px solid #cccccc;
    margin: auto;
    position: relative;
`

export const NavLogoWrapper = styled.div`
    height: 80px;
    width: 50%;
    overflow: hidden;
    text-align: left;
    left: 0;
    position: relative;
    display: inline-block;
`

export const NavLogo = styled.img`
    height: 40px;
    padding: 20px;
    object-fit: contain;
    opacity: 1;
    background-color: #f0f0f0;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }
`

export const NavLogoShort = styled(NavLogo)`
    position: absolute;
    height: 34px;
    padding: 23px;
    opacity: 1;
    padding-right: 200px;    
    background-color: #f0f0f0;

    &:hover {
        opacity: 0;
        margin-left: 4px;
    }
`

export const NavItemsWrapper = styled.span`
    width: 50%;
    height: 100%;
    position: relative;
    display: inline-block;
    text-align: right;
    vertical-align: top;
`

export const NavItem = styled.span`
    width: 100%;
    padding: 0px 5px;
`

export const LinkText = styled.a`
    font-size: 20px;
    font-weight: 500;
    color: #f0f0f0;
    cursor: pointer;
    padding-right: 4px;
    padding-left: 8px;
    vertical-align: top;
`

export const NavLinkIcon = styled.a`
    line-height: 78px;
    padding: 0px 9px 2px 9px;
    border-radius: 50px;
    background-color: #000;
    color: #f0f0f0;
    cursor: pointer;
    font-size: 22px;
    transition: 0.15s;
    border:  ${({isUser}) => (isUser ? '1px solid #000' : '')};

    &:hover {
        background-color: #252525;
        border:  ${({isUser}) => (isUser ? '1px solid #000' : '')};
    }
`