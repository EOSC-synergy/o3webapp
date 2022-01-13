import * as React from 'react';
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import LandingPage from './views/landingPage/LandingPage';
import EditModelGroupModal from './views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator/EditModelGroupModal/temp';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @returns {JSX} a jsx containing all main components
 */
function App() {

    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error
    const [isCookieConsentModalVisible, setCookieConsentModalVisibility] = React.useState(true);
    const [isEditVisible, setEditVisible] = React.useState(false);

    /**
     * function to report an error from other components
     * automatically opens errorModal
     * @param {string} msg the message of the reported error
     */
    const reportError = (msg) => {
        setErrorModalVisible(true);
        setErrorMessage(msg);
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
    
    const closeEditModal = () => {
        setEditVisible(false);
    }

    const openEditModal = () => {
        setEditVisible(true);
    }

    return (
    <>
        <NavBar error={reportError} />

        <LandingPage error={reportError} />
        <EditModelGroupModal open={isEditVisible} error={reportError} onClose={closeEditModal} />
        <button onChange={openEditModal}>Open Edit Model Group</button>

        <Footer error={reportError} />
        <ErrorMessageModal open={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
        <CookieConsentModal open={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;