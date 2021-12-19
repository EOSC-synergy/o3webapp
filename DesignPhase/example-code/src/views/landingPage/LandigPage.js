import * as React from 'react';
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Graph from './views/landingPage/Graph/Graph';
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';

/**
 * main view of web page
 * @param {Object} props
 * @param {function} props.reportError - function to report an error
 * @returns {JSX} a jsx containing all main components
 */
function LandingPage(props) {

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    
    const openSidebar = () => {
        setOpenSidebar(true);
    }

    const closeSidebar = () => {
        setOpenSidebar(true);
    }
    

    return (
    <>
        <Sidebar reportError={props.reportError} open={isSidebarOpen} onClose={handleSidebarClose} />
        <Graph reportError={props.reportError} />
    </>
    );
}

export default App;