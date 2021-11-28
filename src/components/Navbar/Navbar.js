import React from 'react';
import * as s from './Navbar.elements';
import { IconContext } from 'react-icons/lib';
import { BsCircleFill } from 'react-icons/bs'
import { FiMove, FiPlus } from 'react-icons/fi'

import PaguineoLogo from '../../assets/paguineo-part-01.svg';
import PaguineoLogoShort from '../../assets/paguineo-part-02.svg';

const Navbar = () => {
    return (
        <>
            <IconContext.Provider value={{ size: 18 }}>
                <s.NavbarContainer>
                    <s.NavbarWrapper>
                        <s.NavLogoWrapper>
                            <s.NavLogoShort src={PaguineoLogoShort} alt="logo" />
                            <s.NavLogo src={PaguineoLogo} alt="logo" />
                        </s.NavLogoWrapper>

                        <s.NavItemsWrapper>
                            <s.NavItem>
                                <s.NavLinkIcon><FiPlus /></s.NavLinkIcon>
                            </s.NavItem>

                            <s.NavItem>
                                <s.NavLinkIcon><FiMove /></s.NavLinkIcon>
                            </s.NavItem>

                            <s.NavItem>
                                <s.NavLinkIcon isUser={true}>
                                    <s.LinkText>isaul.eth</s.LinkText><BsCircleFill />
                                </s.NavLinkIcon>
                            </s.NavItem>
                        </s.NavItemsWrapper>
                    </s.NavbarWrapper>
                </s.NavbarContainer>
            </IconContext.Provider>
        </>
    )
}

export default Navbar
