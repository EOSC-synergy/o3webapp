import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import PropTypes from "prop-types";
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 400;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: 0,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
      }),
    }),
  );

/**
 * main view of web page
 * @component
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @param {function} props.openSidebar - function to open the sidebar
 * @param {function} props.closeSidebar - function to close the sidebar
 * @param {boolean} props.isSidebarOpen - boolean to indicate whether the sidebar is open or not
 * @returns {JSX.Element} a jsx containing all main components
 */
function LandingPage(props) {

    const [landingPageHeight, setLandingPageHeight] = React.useState(0);

    React.useEffect(() => {
        setLandingPageHeight(window.innerHeight - document.getElementById('Navbar').offsetHeight);
    }, []);

    return (
        <div data-testid="landingPage" style={{width: "100%", height: "100%"}}>
            <Sidebar
                reportError={props.reportError}
                onOpen={props.openSidebar}
                isOpen={props.isSidebarOpen}
                onClose={props.closeSidebar}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: landingPageHeight
                }}
                data-testid="landingPage-not-sidebar"
                onClick={props.closeSidebar}
            >
                <Main open={props.isSidebarOpen}>
                    <Graph reportError={props.reportError} isSidebarOpen={props.isSidebarOpen}/>
                </Main>
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