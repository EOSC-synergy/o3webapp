import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import Button from '@mui/material/Button';
import PropTypes from "prop-types";
import { FormControl, Grid } from '@mui/material';
import { height, width } from '@mui/system';
import ModelGroupConfigurator from './Sidebar/InputComponents/ModelGroupConfigurator/ModelGroupConfigurator';



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
    <div data-testid="landingPage" style={{width: "100%"}}> 
      <Sidebar reportError={props.reportError} isOpen={props.isSidebarOpen} onClose={props.closeSidebar} onOpen={props.openSidebar} />
  
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{width: "95%"}}>
          <Graph reportError={props.reportError} />
        </div>
      </div>
      
    </div>
    );
}

LandingPage.propTypes = {
    reportError: PropTypes.func,
}

export default LandingPage;