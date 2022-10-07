import React, { useState } from 'react';
import * as s from './Search.elements';
import { IconContext } from 'react-icons/lib';
import { BiSearch } from 'react-icons/bi';

const Dashboard = ({ expand, setExpand }) => {
    const [active, setActive] = useState(true);

    return (
        <>
            <IconContext.Provider value={{ size: 26, color: '#888' }}>
                {expand ?
                    null
                    :
                    <s.SearchContainer active={active}>
                        <s.TextContainer active={active}>
                            <s.SearchBar autocomplete="off" active={active}>
                                <s.IconWrap onClick={() => setActive(!active)}>
                                    <BiSearch />
                                </s.IconWrap>
                                <s.SearchInput active={active} name="search" type="text" spellcheck="false" autocomplete="off" />
                            </s.SearchBar>
                        </s.TextContainer>
                    </s.SearchContainer>}
            </IconContext.Provider>
        </>
    )
}

export default Dashboard

