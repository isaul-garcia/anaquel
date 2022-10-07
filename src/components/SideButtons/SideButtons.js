import React from 'react';
import * as s from './SideButtons.elements';
import { IconContext } from 'react-icons/lib';
import { FiPlus, FiFilter, FiMoreVertical, FiHash, FiMove } from 'react-icons/fi';

const Dashboard = ({expand}) => {

    return (
        <>
            <IconContext.Provider value={{ size: 16, color: '#888' }}>
                <s.UIContainer isRight={false} expand={expand}>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiPlus /></s.ButtonWrapper>
                    </s.ButtonContainer>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiFilter /></s.ButtonWrapper>
                    </s.ButtonContainer>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiMoreVertical /></s.ButtonWrapper>
                    </s.ButtonContainer>
                </s.UIContainer>

                <s.UIContainer isRight={true} expand={expand}>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiPlus /></s.ButtonWrapper>
                    </s.ButtonContainer>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiFilter /></s.ButtonWrapper>
                    </s.ButtonContainer>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiHash /></s.ButtonWrapper>
                    </s.ButtonContainer>
                    <s.ButtonContainer>
                        <s.ButtonWrapper><FiMove /></s.ButtonWrapper>
                    </s.ButtonContainer>
                </s.UIContainer>
            </IconContext.Provider>
        </>
    )
}

export default Dashboard

