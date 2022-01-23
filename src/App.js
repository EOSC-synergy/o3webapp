import * as React from 'react';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LandingPage from './views/landingPage/LandingPage';
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import DiscardChangesModal from './components/DiscardChangesModal/DiscardChangesModal';

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
        setErrorModalVisible(true);
        setErrorMessage(msg);
    }
    
    const closeErrorModal = () => {
        isErrorModalVisible(false);
    }

    const closeCookieConsentModal = () => {
    }

    const [isDiscardChangesModalVisible, setDiscardChangesModalVisible] = React.useState(false);

    const openDiscardChangesModal = () => {
        setDiscardChangesModalVisible(true);
    };
  
    const closeDiscardChangesModal = () => {
        setDiscardChangesModalVisible(false);
    };
    

    return (
    <>
        {/* <Navbar error={reportError} />
        <LandingPage error={reportError} />
        <Footer error={reportError} />
        <ErrorMessageModal open={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
        <CookieConsentModal open={isCookieConsentModalVisible} onClose={closeCookieConsentModal} error={reportError} /> */}
        <button onClick={openDiscardChangesModal}>Dev</button>
        <DiscardChangesModal isOpen={isDiscardChangesModalVisible} />
    </>
    );
}

export default App;