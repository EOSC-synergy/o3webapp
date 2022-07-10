import React from 'react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ErrorMessageModal from '../src/components/ErrorMessageModal';
import LandingPage from '../src/views/landingPage/LandingPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    fetchModels,
    fetchPlotDataForCurrentModels,
    fetchPlotTypes,
    getAllSelectedModels,
} from '../src/services/API/apiSlice/apiSlice';
import { generateNewUrl, updateStoreWithQuery } from '../src/services/url/url';
import { setModelsOfModelGroup } from '../src/store/modelsSlice/modelsSlice';
import { DEFAULT_MODEL_GROUP } from '../src/utils/constants';
import { bindActionCreators } from 'redux';
import { connect, useStore } from 'react-redux';
import { wrapper } from '../src/store/store';
import _ from 'lodash';

/**
 * Main container of the Webapp.
 * Contains all GUI elements.
 * @component
 * @returns {JSX.Element} A jsx containing all main components
 */
function App({ fetchPlotTypes, fetchModels, fetchPlotDataForCurrentModels, models }) {
    const store = useStore();

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
    const [errorMessage, setErrorMessage] = React.useState(null); // if errorMessage null no error

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

    useEffect(() => {
        isSidebarOpen ? disableBodyScroll(document) : enableBodyScroll(document);
    }, [isSidebarOpen]);

    /**
     * Function to open sidebar
     * @function
     */
    const openSidebar = () => {
        setSidebarOpen(true);
    };

    /**
     * Function to close sidebar,
     * if the user does not currently try to navigate the sidebar
     * @param {event} event the event that triggered the call of this function
     * @function
     */
    const closeSidebar = (event) => {
        // for accessibility do not close sidebar if users
        // try to navigate sidebar using Tab or Shift
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setSidebarOpen(false);
    };

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
    };

    /**
     * Closes the error modal
     * @function
     */
    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    /**
     * Object containing the theming information about the webapp.
     * @constant {Object}
     */
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#fed136',
            },
            background: {
                paper: '#262626',
            },
        },
    });

    const router = useRouter();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (router.isReady && !ready) {
            fetchPlotTypes();
            fetchModels().then(() => {
                updateStoreWithQuery(store, router.query);
                fetchPlotDataForCurrentModels(models, _.isEmpty(router.query));
            });

            store.subscribe(() => {
                router.push(
                    {
                        query: generateNewUrl(store),
                    },
                    undefined,
                    { shallow: true }
                );
            });

            setReady(true);
        }
    }, [router.isReady, ready]);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar reportError={reportError} openSidebar={openSidebar} />
                {ready && (
                    <LandingPage
                        reportError={reportError}
                        openSidebar={openSidebar}
                        closeSidebar={closeSidebar}
                        isSidebarOpen={isSidebarOpen}
                    />
                )}
                <Footer reportError={reportError} />
                <ErrorMessageModal
                    isOpen={isErrorModalVisible}
                    message={errorMessage}
                    onClose={closeErrorModal}
                />
                {/* <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} /> */}
            </div>
        </ThemeProvider>
    );
}

export const getStaticProps = wrapper.getStaticProps((store) => () => {
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));
});

const mapStateToProps = (state) => {
    return {
        models: getAllSelectedModels(() => state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPlotTypes: bindActionCreators(fetchPlotTypes, dispatch),
        fetchModels: bindActionCreators(fetchModels, dispatch),
        fetchPlotDataForCurrentModels: bindActionCreators(fetchPlotDataForCurrentModels, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
