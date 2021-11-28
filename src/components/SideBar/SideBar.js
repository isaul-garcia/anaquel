import React from 'react';
import * as s from './SideBar.elements';
import { IconContext } from 'react-icons/lib';
import { MdWeb } from 'react-icons/md';
import { HiSearch } from 'react-icons/hi';

import Image1 from '../../assets/hardcoded-screenshots/ss1.jpg'
import Image2 from '../../assets/hardcoded-screenshots/ss3.jpg'
import Image3 from '../../assets/hardcoded-screenshots/ss17.jpg'
import Image4 from '../../assets/hardcoded-screenshots/ss30.jpg'
import Image5 from '../../assets/hardcoded-screenshots/ss31.jpg'
import Image6 from '../../assets/hardcoded-screenshots/ss32.jpg'
import Image7 from '../../assets/hardcoded-screenshots/ss28.jpg'
import Image8 from '../../assets/hardcoded-screenshots/ss29.jpg'
import Image9 from '../../assets/ig-screenshot.jpg'

const Dashboard = (click) => {
    return (
        <>
            <IconContext.Provider value={{ size: 40, color: '#999' }}>
                <s.SideBarContainer click={click}>
                    <s.SideBarWrapper>

                        <s.TopBar>
                            <s.Title>Bookmark Folders</s.Title>
                            <s.Description>Here are all your folders.</s.Description>
                        </s.TopBar>

                        {/* <s.Notice>There are no pins to show.</s.Notice> */}

                        <IconContext.Provider value={{ size: 40, color: '#111' }}>
                        <s.FolderContainer>
                            <s.FolderWrapper>
                                <s.FolderIconContainer folderColor={"#89ee46"}>
                                    <s.FolderIconWrapper >
                                        <MdWeb />
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.SideSpacer />
                                <s.FolderImage src={Image1} />
                                <s.FolderImage src={Image2} />
                                <s.FolderImage src={Image3} />
                            </s.FolderWrapper>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper>
                                <s.FolderIconContainer folderColor={"#f5e841"}>
                                    <s.FolderIconWrapper >
                                        <MdWeb />
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.SideSpacer />
                                <s.FolderImage src={Image4} />
                                <s.FolderImage src={Image5} />
                                <s.FolderImage src={Image6} />
                            </s.FolderWrapper>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper>
                                <s.FolderIconContainer folderColor={"#5148f2"}>
                                    <s.FolderIconWrapper >
                                        <MdWeb />
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.SideSpacer />
                                <s.FolderImage src={Image7} />
                                <s.FolderImage src={Image8} />
                                <s.FolderImage src={Image9} />
                            </s.FolderWrapper>
                        </s.FolderContainer>
                        </IconContext.Provider>

                        <s.SearchBar>
                            <s.SearchButton><HiSearch size={25} /></s.SearchButton>
                            <s.SearchInput name="search" type="Search" placeholder="Search Folders" />
                        </s.SearchBar>

                    </s.SideBarWrapper>
                </s.SideBarContainer>
            </IconContext.Provider>
        </>
    )
}

export default Dashboard
