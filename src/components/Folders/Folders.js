import React from 'react';
import * as s from './Folders.elements';
import { IconContext } from 'react-icons/lib';

const Dashboard = ({ expand }) => {
    return (
        <>
            <IconContext.Provider value={{ size: 40, color: '#999' }}>

                <s.SideBarContainer expand={expand}>
                    <s.SideBarWrapper>

                        <s.SpacerSmall />

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.SmallFolderIconContainer folderColor={"#fa520a"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>1</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#f11212"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>i</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#4e31bf"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#aed231"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#0482ff"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>l</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#0f0fff"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#4e31bf"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#fa520a"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#aed231"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>All Apps</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.SmallFolderIconContainer folderColor={"#0482ff"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>1</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#4e31bf"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>i</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#ffe244"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#d23ff1"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#faaa0a"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>l</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#0f0faa"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#fa520a"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#33ff39"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                                <s.SmallFolderIconContainer folderColor={"#4e31bf"}>
                                    <s.SmallFolderIconWrapper>
                                        <s.SmallLetterIcon>R</s.SmallLetterIcon>
                                    </s.SmallFolderIconWrapper>
                                </s.SmallFolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>All Bookmarks</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>A</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Work</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon letterColor={"#0482ff"}>1</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Games</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>K</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Trading</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>R</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Useful APIs</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>W</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Memes</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>I</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Articles</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>A</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Learning</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>A</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Wishlist</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                        <s.FolderContainer>
                            <s.FolderWrapper backColor={"#111"}>
                                <s.FolderFaviconContainer folderColor={"#0482ff"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon>A</s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderFaviconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                                <s.FolderIconContainer folderColor={"#191919"}>
                                    <s.FolderIconWrapper>
                                        <s.LetterIcon></s.LetterIcon>
                                    </s.FolderIconWrapper>
                                </s.FolderIconContainer>
                            </s.FolderWrapper>
                            <s.NameContainer>
                                <s.NameWrapper>
                                    <s.Name>Places</s.Name>
                                </s.NameWrapper>
                            </s.NameContainer>
                        </s.FolderContainer>

                    </s.SideBarWrapper>
                </s.SideBarContainer>
            </IconContext.Provider>
        </>
    )
}

export default Dashboard
