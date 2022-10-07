import React from 'react';
import * as s from './Footer.elements';
import { IconContext } from 'react-icons/lib';

const Dashboard = () => {
    return (
        <>
            <IconContext.Provider value={{ size: 40, color: '#999' }}>

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

            </IconContext.Provider>
        </>
    )
}

export default Dashboard
