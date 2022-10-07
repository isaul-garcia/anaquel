import React from 'react';
import * as s from './Tray.elements';

import { Folders, Bookmarks, SideButtons } from '../index';

const Dashboard = ({expand}) => {
    return (
        <>
            <s.Container expand={expand}>
                <s.Wrapper>

                    <s.SearchBack expand={expand}>0</s.SearchBack>
                    <s.SearchBar autocomplete="off" expand={expand}>
                        <s.SearchInput name="sSearch" type="text" placeholder="Search" spellcheck="false" autocomplete="off"/>
                    </s.SearchBar>

                    <s.FolderTrayContainer expand={expand}>
                        <s.FolderTrayWrapper>
                            <Folders expand={expand}/>
                        </s.FolderTrayWrapper>
                    </s.FolderTrayContainer>

                    <s.MarksTrayContainer>
                        <s.MarksTrayWrapper>
                            <s.TrayName expand={expand}>All Bookmarks</s.TrayName>
                            <Bookmarks expand={expand}/>
                        </s.MarksTrayWrapper>
                    </s.MarksTrayContainer>
                    
                </s.Wrapper>
            </s.Container>
            
            <SideButtons expand={expand}/>
        </>
    )
}

export default Dashboard

