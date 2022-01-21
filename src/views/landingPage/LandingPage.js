import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import Button from '@mui/material/Button';
import PropTypes from "prop-types";

/**
 * main view of web page
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @returns {JSX} a jsx containing all main components
 */
function LandingPage(props) {

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    
    /**
     * Function to open sidebar
     */
    const openSidebar = () => {
        setSidebarOpen(true);
    }

    /**
     * Function to close sidebar,
     * if the user does not currently try to navigate the sidebar
     * @param {event} event the event that triggered the call of this function
     */
    const closeSidebar = (event) => {
        // for accessibility do not close sidebar if users 
        // try to navigate sidebar using Tab or Shift
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
    <div data-testid="landingPage">

        <Button variant="outlined" onClick={openSidebar}>Open Sidebar (Dev)</Button>
        <Sidebar reportError={props.reportError} isOpen={isSidebarOpen} onClose={closeSidebar} onOpen={openSidebar} />
        <Graph reportError={props.reportError} />

    </div>
    );
}

LandingPage.propTypes = {
    reportError: PropTypes.func,
}

export default LandingPage;