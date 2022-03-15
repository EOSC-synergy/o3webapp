import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import PropTypes from "prop-types";
import { styled } from '@mui/material/styles';

/**
 * The width of the Drawer.
 * @see {@link Sidebar}
 * @constant {int}
 * @default 400
 * @memberof LandingPage
 */
const drawerWidth = 400;

/**
 * Main component, that can be collapsed in order to see both the sidebar and the landing page next to each other.
 * @memberof LandingPage
 * @constant {JSX.Element}
 */
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
 * Main view of web page. Wrapper for all other components on the landing PAge.
 * @component
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} a jsx containing all main components
 */
function LandingPage(props) {

    /**
     * state to keep track of the current height of the landing Page.
     * @const {Array}
     * @default 0
     */
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
    /**
     * function for error handling
     */
    reportError: PropTypes.func.isRequired,
    /**
     * function to open the sidebar
     */
    isSidebarOpen: PropTypes.bool.isRequired,
    /**
     * function to close the sidebar
     */
    closeSidebar: PropTypes.func.isRequired,
    /**
     * boolean to indicate whether the sidebar is open or not
     */
    openSidebar: PropTypes.func.isRequired,
}

export default LandingPage;