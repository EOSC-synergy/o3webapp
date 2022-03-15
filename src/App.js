import * as React from 'react';
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import LandingPage from './views/landingPage/LandingPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';


/**
 * Main container of the Webapp.
 * Contains all GUI elements.
 * @component
 * @returns {JSX.Element} A jsx containing all main components
 */
function App() {

    /**
     * State that holds the boolean whether the ErrorMessageModal is currently visible or not.
     * @constant {boolean}
     */
    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    /**
     * The error message if an error has occured.
     * If no error occured the state is set to null.
     * @constant {string}
     */
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error

    /**
     * A queue holding all incoming and unprocessed error messages.
     * @constant {Array}
     */
    const [errorMessages, setErrorMessages] = React.useState([]);

    /**
     * State that holds the boolean whether the Sidebar is currently open or not.
     * @constant {boolean}
     */
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    isSidebarOpen ? disableBodyScroll(document) : enableBodyScroll(document);

    /**
     * Function to open sidebar
     * @function
     */
    const openSidebar = () => {
        setSidebarOpen(true);
    }

    /**
     * Function to close sidebar,
     * if the user does not currently try to navigate the sidebar
     * @param {event} event the event that triggered the call of this function
     * @function
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
     * Function to report an error from other components.
     * Automatically opens errorModal
     * @param {string} msg the message of the reported error
     * @function
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
     * Closes the error modal
     * @function
     */
    const closeErrorModal = () => {
        setErrorModalVisible(false);
    }

    /**
     * Object containing the theming information about the webapp.
     * @constant {Object}
     */
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
                <Navbar reportError={reportError} openSidebar={openSidebar} />
                <LandingPage reportError={reportError} openSidebar={openSidebar} closeSidebar={closeSidebar} isSidebarOpen={isSidebarOpen} />
                <Footer reportError={reportError} />
                <ErrorMessageModal isOpen={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
                {/* <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} /> */}
            </div>
        </ThemeProvider>
    );
}

export default App;