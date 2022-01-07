import * as React from 'react';
import NavBar from "./components/Navbar/NavBar";
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

    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error
    const [isCookieConsentModalVisible, setCookieConsentModalVisibility] = React.useState(true);

    const reportError = (msg) => {
        setError(msg);
    }
    
    const closeErrorModal = () => {
        setError(null);
    }

    const closeCookieConsentModal = () => {
    }
    

    return (
    <>
        <NavBar error={reportError} handleSidebarOpen={handleSidebarOpen} />
        <LandingPage error={reportError} />
        <Footer error={reportError} />
        <ErrorMessageModal open={error !== null} message={error} onClose={closeErrorModal} />
        <CookieConsentModal open={showCookieConsentModal} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;