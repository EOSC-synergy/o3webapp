import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import PropTypes from "prop-types";

/**
 * main view of web page
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @param {function} props.openSidebar - function to open the sidebar
 * @param {function} props.closeSidebar - function to close the sidebar
 * @param {boolean} props.isSidebarOpen - boolean to indicate whether the sidebar is open or not
 * @returns {JSX.Element} a jsx containing all main components
 */
function LandingPage(props) {
    
    return (
    <div data-testid="landingPage" style={{width: "100%", height: "100%"}}> 
      <Sidebar reportError={props.reportError} onOpen={props.openSidebar} isOpen={props.isSidebarOpen} onClose={props.closeSidebar} />
      
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}} onClose={props.closeSidebar}>
        <div style={{width: "95%", marginTop: "2%"}}>
          <Graph reportError={props.reportError} />
        </div>
      </div>
      
    </div>
    );
}

LandingPage.propTypes = {
    reportError: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    openSidebar: PropTypes.func.isRequired,
}

export default LandingPage;