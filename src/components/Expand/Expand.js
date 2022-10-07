import React from 'react';
import * as s from './Expand.elements';

const Dashboard = ({expand, setExpand}) => {
    return (
        <>
            <s.ExpandContainer expand={expand}>
                <s.TextContainer onClick={() => (setExpand(!expand))}>
                    <s.TextWrapper>{expand ? 'Collapse' : 'Expand'}</s.TextWrapper>
                </s.TextContainer>
            </s.ExpandContainer>
        </>
    )
}

export default Dashboard

