import * as React from 'react';
import Graph from './Graph/Graph';
import ModelGroupConfigurator from './Sidebar/InputComponents/ModelGroupConfigurator/ModelGroupConfigurator';
import Sidebar from './Sidebar/Sidebar';


/**
 * main view of web page
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @returns {JSX} a jsx containing all main components
 */
function LandingPage(props) {

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    
    const openSidebar = () => {
        setSidebarOpen(true);
    }

    const closeSidebar = () => {
        setSidebarOpen(true);
    }
    

    return (
    <>
        {/* For dev reasons */}
        <ModelGroupConfigurator />
        <Sidebar reportError={props.reportError} open={isSidebarOpen} onClose={closeSidebar} />
        <Graph reportError={props.reportError} />
    </>
    );
}

export default LandingPage;