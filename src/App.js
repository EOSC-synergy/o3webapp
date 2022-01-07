import * as React from 'react';
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import LandingPage from './views/landingPage/LandigPage';

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
        setErrorModalVisible(false);
    }

    const onCloseCookieConsentModal = () => {
    }
    

    return (
    <>
        <NavBar error={reportError} />

        <LandingPage error={reportError} />

        <Footer error={reportError} />
        <ErrorMessageModal open={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
        <CookieConsentModal open={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;