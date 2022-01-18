import * as React from 'react';
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import LandingPage from './views/landingPage/LandingPage';
import PropTypes from "prop-types";
import PlotTypeSelector from "./views/landingPage/Sidebar/InputComponents/PlotTypeSelector/PlotTypeSelector";

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
        setErrorMessage(msg);
        setErrorModalVisible(true);
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
    const onCloseCookieConsentModal = (event, reason) => {
        if (reason !== 'backdropClick') {
            setCookieConsentModalVisibility(false);
            // store accepting cookies
        }
    }


    return (
    <div style={{minHeight: "100vh", display: 'flex', flexDirection: 'column'}}>
        <Navbar error={reportError} />
        <LandingPage error={reportError} /> 
        <Footer error={reportError} />
        {/*<ErrorMessageModal open={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />*/}
        <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} />
    </div>
    );
}

export default App;