import React from 'react';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import ErrorMessageModal from 'components/ErrorMessageModal';
import LandingPage from 'views/landingPage/LandingPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes } from 'services/API/apiSlice';
import { generateNewUrl, updateStoreWithQuery } from 'services/url';
import { setModelsOfModelGroup } from 'store/modelsSlice';
import { DEFAULT_MODEL_GROUP } from 'utils/constants';
import { connect } from 'react-redux';
import { useAppDispatch, useAppStore, wrapper } from 'store';
import { debounce, isEmpty } from 'lodash';
import { GetStaticProps, NextPage } from 'next';

/**
 * Main container of the Webapp. Contains all GUI elements.
 *
 * @returns {JSX.Element} A jsx containing all main components
 * @component
 */
const App: NextPage<IndexProps> = () => {
    const store = useAppStore();

    /**
     * State that holds the boolean whether the ErrorMessageModal is currently visible or not.
     *
     * @constant {boolean}
     */
    const [isErrorModalVisible, setErrorModalVisible] = useState(false);
    /**
     * The error message if an error has occured. If no error occured the state is set to null.
     *
     * @constant {string}
     */
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // if errorMessage null no error

    /**
     * A queue holding all incoming and unprocessed error messages.
     *
     * @constant {Array}
     */
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (sidebarOpen) {
            disableBodyScroll(document.body);
        } else {
            enableBodyScroll(document.body);
        }
    }, [sidebarOpen]);

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    // TODO: event?
    const closeSidebar = (/*event*/) => {
        /*
        // for accessibility do not close sidebar if users
        // try to navigate sidebar using Tab or Shift
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        */
        setSidebarOpen(false);
    };

    const reportError = (message: string) => {
        if (errorMessages.some((errorMessage) => errorMessage === message)) {
            return;
        }
        setErrorMessages([...errorMessages, message]);

        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

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

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (router.isReady && !ready) {
            dispatch(fetchPlotTypes());
            dispatch(fetchModels()).then(() => {
                updateStoreWithQuery(
                    store.dispatch,
                    store.getState(),
                    router.query as Record<string, string>
                );
                dispatch(fetchPlotDataForCurrentModels(isEmpty(router.query)));
            });

            store.subscribe(
                debounce(() => {
                    router.replace(
                        {
                            query: generateNewUrl(store.getState()),
                        },
                        undefined,
                        { shallow: true }
                    );
                }, 1000)
            );

            setReady(true);
        }
    }, [router.isReady, ready]);

    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    minHeight: '100svh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Navbar openSidebar={openSidebar} />
                {ready && (
                    <LandingPage
                        reportError={reportError}
                        openSidebar={openSidebar}
                        closeSidebar={closeSidebar}
                        isSidebarOpen={sidebarOpen}
                    />
                )}
                <div
                    style={{
                        flexGrow: 0,
                    }}
                >
                    <Footer />
                </div>
                <ErrorMessageModal
                    isOpen={isErrorModalVisible}
                    message={errorMessage}
                    onClose={closeErrorModal}
                />
                {/* <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} /> */}
            </div>
        </ThemeProvider>
    );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps((store) => async () => {
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));
    return {
        props: {},
    };
});

const mapStateToProps = (/*state: AppState*/) => {
    return {
        //models: getAllSelectedModels(() => state),
    };
};

/**
 * Does not work nicely with redux-toolkit / redux nextjs due to bindActionCreators forcing native
 * redux 'Dispatch' type which does not support async stuff we need
 */
const mapDispatchToProps = (/*dispatch: AppDispatch*/) => {
    return {
        //fetchPlotTypes: bindActionCreators(fetchPlotTypes, dispatch),
        //fetchModels: bindActionCreators(fetchModels, dispatch),
        //fetchPlotDataForCurrentModels: bindActionCreators(fetchPlotDataForCurrentModels, dispatch),
    };
};

type IndexProps = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(App);
