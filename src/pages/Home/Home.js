import React, { useState } from 'react';
import { Tray, Expand, Footer } from '../../components';

const Home = () => {
    const [expand, setExpand] = useState(true);
    return (
        <>
            <Tray expand={expand} />
            <Expand expand={expand} setExpand={setExpand}/>
            <Footer />
        </>
    )
}

export default Home;