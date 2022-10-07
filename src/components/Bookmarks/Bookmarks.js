import React, { useState } from 'react';
import * as s from './Bookmarks.elements';
import { IconContext } from 'react-icons/lib';
import { allBookmarks } from './Data';

const WebsiteIcon = ({ ...props }) => {
    return (
        <>
            <s.WebsiteCard>
                {props.isApp ?
                    <s.WebsiteApp>
                        <s.WebsiteContainer>
                            <s.WebsiteWrapper>
                                <s.WebsiteImage src={props.favicon} />
                            </s.WebsiteWrapper>
                        </s.WebsiteContainer>
                    </s.WebsiteApp>
                    :
                    <s.WebsiteContainer>
                        <s.WebsiteWrapper>
                            <s.WebsiteImage src={props.favicon} />
                        </s.WebsiteWrapper>
                    </s.WebsiteContainer>
                }
                <s.NameContainer>
                    <s.NameWrapper>
                        <s.IPFS isIPFS={props.isIPFS} isPinned={props.isPinned} />
                        <s.Name isIPFS={props.isIPFS}>{props.siteName}</s.Name>
                    </s.NameWrapper>
                </s.NameContainer>
            </s.WebsiteCard>
        </>
    )
}

const Dashboard = ({ expand }) => {
    const [state, setState] = useState(allBookmarks);
    return (
        <>
            <IconContext.Provider value={{ size: 30, color: '#888' }}>
                <s.BookmarksTrayContainer>
                    <s.BookmarksTrayWrapper expand={expand}>

                        <s.SpacerXSmall expand={expand} />

                        <s.customReactSortable list={state} setList={setState}>
                            {state.map((props, id) => (
                                <WebsiteIcon key={id} {...props} />
                            ))}
                        </s.customReactSortable>
                    </s.BookmarksTrayWrapper>
                </s.BookmarksTrayContainer>
            </IconContext.Provider>
        </>
    )
}

export default Dashboard
