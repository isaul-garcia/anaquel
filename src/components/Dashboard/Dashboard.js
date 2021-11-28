import React from 'react';
import * as s from './Dashboard.elements';

import { SideBar, Bookmarks } from '../index';

const Dashboard = (click) => {
    return (
        <>
            <s.DashboardContainer>
                <s.DashboardWrapper>
                    <SideBar click={click}/>
                    <Bookmarks />
                </s.DashboardWrapper>
            </s.DashboardContainer>
        </>
    )
}

export default Dashboard

