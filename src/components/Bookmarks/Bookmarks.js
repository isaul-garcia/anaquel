import React from 'react';
import * as s from './Bookmarks.elements';
import { IconContext } from 'react-icons/lib';
import { MdWeb } from 'react-icons/md';
import { HiSearch } from 'react-icons/hi';

import Image from '../../assets/hardcoded-screenshots/ss1.jpg'
import Image1 from '../../assets/hardcoded-screenshots/ss1.jpg'
import Image2 from '../../assets/hardcoded-screenshots/ss3.jpg'
import Image3 from '../../assets/hardcoded-screenshots/ss17.jpg'
import Image4 from '../../assets/hardcoded-screenshots/ss15.jpg'
import Image5 from '../../assets/hardcoded-screenshots/ss22.jpg'
import Image6 from '../../assets/hardcoded-screenshots/ss25.jpg'
import Image7 from '../../assets/hardcoded-screenshots/ss6.jpg'
import Image8 from '../../assets/hardcoded-screenshots/ss11.jpg'
import Image9 from '../../assets/hardcoded-screenshots/ss9.jpg'
import Image10 from '../../assets/hardcoded-screenshots/ss8.jpg'
import Image11 from '../../assets/hardcoded-screenshots/ss12.jpg'
import Image12 from '../../assets/hardcoded-screenshots/ss24.jpg'
import Image13 from '../../assets/hardcoded-screenshots/ss27.jpg'
import Image14 from '../../assets/hardcoded-screenshots/ss4.jpg'
import Image15 from '../../assets/hardcoded-screenshots/ss5.jpg'
import Image16 from '../../assets/hardcoded-screenshots/ss26.jpg'

import Favicon from '../../assets/globeicon.ico';

const Dashboard = () => {
    return (
        <>

            {/*
            -add filter to organize folders (a to z, last saved on, etc)
            -darkmode button
            -MOBILE

            bugs**
            -bookmark container goes off to the right
            */}

            <IconContext.Provider value={{ size: 30, color: '#888' }}>
                <s.BookmarksContainer>
                    <s.BookmarksWrapper>
                        
                    <IconContext.Provider value={{ size: 30, color: '#000' }}>
                        <s.TopBar>
                            <s.FolderIconContainer>
                                <s.FolderIconWrapper >
                                    <MdWeb />
                                </s.FolderIconWrapper>
                            </s.FolderIconContainer>
                            <s.SelectedDescription>
                                <s.Title>For Development</s.Title>
                                <s.Description>List of important tools for development.</s.Description>
                            </s.SelectedDescription>
                        </s.TopBar>
                        </IconContext.Provider>

                        {/* <s.Notice>There are no pins to show.</s.Notice> */}

                        <s.WebsiteCardsContainer>
                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image1} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Gamepad Tester</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image2} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Redux</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image3} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Handlebars.js</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image4} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Three.js and AR.js Examples</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image5} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>github.com/react-devtools</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image6} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>OpenLayers</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image7} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Observable | Mike Bostock</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image8} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>Figma | Figma's multiplayer technology</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image9} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>meilisearch.com/</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image10} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>SaaS Blocks 2.0 Directory</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image11} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>drei Documentation</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image12} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>SortableJS</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image13} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image14} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image15} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image16} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>
                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>
                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>

                            <s.WebsiteCard>
                                <s.WebsiteContainer>
                                    <s.WebsiteWrapper>
                                        <s.FaviconWrapper src={Favicon} />
                                        <s.WebsiteImage src={Image} />
                                    </s.WebsiteWrapper>
                                </s.WebsiteContainer>
                                <s.Name>isaulgarcia.com</s.Name>
                            </s.WebsiteCard>
                        </s.WebsiteCardsContainer>

                        <s.SpacerMedium />

                        <s.SearchBar>
                            <s.SearchButton><HiSearch size={25} /></s.SearchButton>
                            <s.SearchInput name="search" type="Search" placeholder="Search Bookmarks" />
                        </s.SearchBar>

                    </s.BookmarksWrapper>
                </s.BookmarksContainer>
            </IconContext.Provider>
        </>
    )
}

export default Dashboard
