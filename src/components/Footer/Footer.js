import React from 'react';
import * as s from './Footer.elements';

const Dashboard = () => {
    return (
        <>
            <s.FooterContainer>
                <s.FooterWrapper>

                    <s.TextContainer>
                        <s.TextWrapper to="/">Github</s.TextWrapper>
                    </s.TextContainer>

                    <s.TextContainerRight>
                        <s.TextWrapper to="/">Anaquel (0.0.0)</s.TextWrapper>
                    </s.TextContainerRight>

                </s.FooterWrapper>
            </s.FooterContainer>
        </>
    )
}

export default Dashboard
