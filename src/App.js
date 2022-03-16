import * as React from 'react';
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import LandingPage from './views/landingPage/LandingPage';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';


/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @component
 * @returns {JSX.Element} a jsx containing all main components
 */
function App() {

    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error
    // const [isCookieConsentModalVisible, setCookieConsentModalVisibility] = React.useState(true);
    const [errorMessages, setErrorMessages] = React.useState([]);
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    isSidebarOpen ? disableBodyScroll(document) : enableBodyScroll(document);

    /**
     * Function to open sidebar
     */
    const openSidebar = () => {
        setSidebarOpen(true);
    }

    /**
     * Function to close sidebar,
     * if the user does not currently try to navigate the sidebar
     * @param {event} event the event that triggered the call of this function
     */
    const closeSidebar = (event) => {
        // for accessibility do not close sidebar if users
        // try to navigate sidebar using Tab or Shift
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setSidebarOpen(false);
    }

    /**
     * function to report an error from other components
     * automatically opens errorModal
     * @param {string} msg the message of the reported error
     */
    const reportError = (msg) => {
        for (let i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i] === msg) {
                return;
            }
        }
        let copy = errorMessages;
        copy.push(msg);
        setErrorMessages(copy);

        setErrorMessage(msg);
        setErrorModalVisible(true);
    }

    /**
     * closes the error modal
     */
    const closeErrorModal = () => {
        setErrorModalVisible(false);
    }

    // /**
    //  * closes the cookie consent modal
    //  */
    // const onCloseCookieConsentModal = (event, reason) => {
    //     if (reason !== 'backdropClick') {
    //         setCookieConsentModalVisibility(false);
    //         // store accepting cookies
    //     }
    // }

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: "#fed136"
            },
            background: {
                paper: "#262626"
            }
        }
    });


    return (
        <ThemeProvider theme={theme}>
            <div style={{minHeight: "100vh", display: 'flex', flexDirection: 'column'}}>
                <Navbar reportError={reportError} openSidebar={openSidebar}/>
                <LandingPage reportError={reportError} openSidebar={openSidebar} closeSidebar={closeSidebar}
                             isSidebarOpen={isSidebarOpen}/>
                <Footer reportError={reportError}/>
                <ErrorMessageModal isOpen={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal}/>
                {/* <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} /> */}
            </div>
        </ThemeProvider>
    );
}

export default App;