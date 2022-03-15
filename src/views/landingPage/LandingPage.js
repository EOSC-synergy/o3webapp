import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import PropTypes from "prop-types";

/**
 * main view of web page
 * @component
 * @param {Object} props specified in propTypes
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
                <div style={{width: "95%"}}>
                    <Graph reportError={props.reportError}/>
                </div>
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