import * as React from 'react';
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Graph from './views/landingPage/Graph/Graph';
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @returns {JSX} a jsx containing all main components
 */
function App() {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [error, setError] = React.useState(null);  // error is used for errors in event handler functions
    const [showCookieConsentModal, setShowCookieConsentModal] = React.useState(true);

    const reportError = (msg) => {
        setError(msg);
    }
    
    const closeErrorModal = () => {
        setError(null);
    }
    
    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    }

    const handleSidebarClose = () => {
        setOpenSidebar(true);
    }

    const onCloseCookieConsentModal = () => {
    }
    

    return (
    <>
        <NavBar error={reportError} handleSidebarOpen={handleSidebarOpen} />
        <Graph error={reportError} />
        <Footer error={reportError} />
        <Sidebar error={reportError} open={openSidebar} onClose={handleSidebarClose} />
        <ErrorMessageModal open={error !== null} message={error} onClose={closeErrorModal} />
        <CookieConsentModal open={showCookieConsentModal} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;