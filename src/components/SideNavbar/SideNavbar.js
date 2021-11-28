import React from 'react';
import * as s from './SideNavbar.elements';
import { IconContext } from 'react-icons/lib';
import { BsCircleFill, BsGithub } from 'react-icons/bs';
import { FiMove, FiPlus, FiFolder } from 'react-icons/fi';

import AnaquelShort from '../../assets/anaquel-logos-04.svg';

const SideNavbar = (click, setClick) => {
    return (
        <>  
            <IconContext.Provider value={{ size: 18 }}>
                <s.NavbarContainer>
                    <s.NavbarWrapper>

                        <s.NavLogoWrapper>
                            <s.NavLogoShort src={AnaquelShort} alt="logo" />
                        </s.NavLogoWrapper>

                        <s.NavItemsWrapper>
                            <s.NavItem onClick={() => setClick(!click)} forMobile={true}>
                                <s.NavLinkIcon><FiFolder /><s.Popover>Add a pin</s.Popover></s.NavLinkIcon>
                            </s.NavItem>

                            <s.NavItem>
                                <s.NavLinkIcon><FiPlus /><s.Popover>Add a pin</s.Popover></s.NavLinkIcon>
                            </s.NavItem>

                            <s.NavItem>
                                <s.NavLinkIcon><FiMove /><s.Popover>Organize pins</s.Popover></s.NavLinkIcon>
                            </s.NavItem>

                            <s.NavItem>
                                <s.NavLinkIcon><BsCircleFill /><s.Popover>All pins</s.Popover></s.NavLinkIcon>
                            </s.NavItem>
                        </s.NavItemsWrapper>

                        <s.NavItemsWrapperBottom>
                            <s.NavItem>
                                <s.NavLinkIcon><BsGithub /></s.NavLinkIcon>
                            </s.NavItem>
                        </s.NavItemsWrapperBottom>

                    </s.NavbarWrapper>
                </s.NavbarContainer>
            </IconContext.Provider>
        </>
    )
}

export default SideNavbar
