import * as React from 'react';
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import LandingPage from './views/landingPage/LandingPage';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @returns {JSX} a jsx containing all main components
 */
function App() {

    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error
    const [isCookieConsentModalVisible, setCookieConsentModalVisibility] = React.useState(true);

    /**
     * function to report an error from other components
     * automatically opens errorModal
     * @param {string} msg the message of the reported error
     */
    const reportError = (msg) => {
        setErrorModalVisible(true);
        setErrorMessage(msg);
        console.log(msg);
    }
    
    /**
     * closes the error modal
     */
    const closeErrorModal = () => {
        setErrorModalVisible(false);
    }

    /**
     * closes the cookie consent modal
     */
    const onCloseCookieConsentModal = () => {
        setCookieConsentModalVisibility(false);
    }
    

    return (
    <>
        <NavBar error={reportError} />

        <LandingPage reportError={reportError} />

        <Footer error={reportError} />
        <ErrorMessageModal open={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
        <CookieConsentModal open={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;