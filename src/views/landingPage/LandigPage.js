import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import Button from '@mui/material/Button';

/**
 * main view of web page
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @returns {JSX} a jsx containing all main components
 */
function LandingPage(props) {

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    
    const openSidebar = (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
          ) {
            return;
          }
        setSidebarOpen(true);
    }

    const closeSidebar = (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
          ) {
            return;
          }
        setSidebarOpen(false);
    }
    

    return (
    <>
        <Button  variant="outlined" onClick={openSidebar}>Open Sidebar (Dev)</Button>
        <Sidebar reportError={props.reportError} isOpen={isSidebarOpen} onClose={closeSidebar} onOpen={openSidebar} />
        <Graph reportError={props.reportError} />
    </>
    );
}

export default LandingPage;