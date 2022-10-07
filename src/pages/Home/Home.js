import React, { useState } from 'react';
import { Tray, Expand, Footer, Search } from '../../components';

const Home = () => {
    const [expand, setExpand] = useState(true);
    return (
        <>
            <Search expand={expand} setExpand={setExpand} />
            <Tray expand={expand} />
            <Expand expand={expand} setExpand={setExpand} />
            <Footer />
        </>
    )
}

export default Home;