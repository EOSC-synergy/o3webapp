import * as React from 'react';
import Graph from './Graph/Graph';
import Sidebar from './Sidebar/Sidebar';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

/**
 * The width of the Drawer.
 * @see {@link Sidebar}
 * @constant {int}
 * @default 400
 * @memberof LandingPage
 */
const drawerWidth = 400;

/**
 * Main component, that can be collapsed in order to see both the sidebar and the landing page next to each other.
 * @memberof LandingPage
 * @constant {JSX.Element}
 */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        }),
    })
);

type LandingPageProps = {
    reportError: (error: string) => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    isSidebarOpen: boolean;
};

/**
 * Main view of web page. Wrapper for all other components on the landing PAge.
 * @component
 * @param reportError function to report an error
 * @param openSidebar function to open the sidebar
 * @param closeSidebar function to close the sidebar
 * @param isSidebarOpen boolean to indicate whether the sidebar is open or not
 * @returns {JSX.Element} a jsx containing all main components
 */
const LandingPage: React.FC<LandingPageProps> = ({
    reportError,
    openSidebar,
    closeSidebar,
    isSidebarOpen,
}) => {
    /**
     * state to keep track of the current height of the landing Page.
     * @const {Array}
     * @default 0
     */
    const [landingPageHeight, setLandingPageHeight] = React.useState(0);

    React.useEffect(() => {
        setLandingPageHeight(
            window.innerHeight - (document.getElementById('Navbar')?.offsetHeight ?? 0)
        );
    }, []);

    return (
        <div data-testid="landingPage" style={{ width: '100%', height: '100%' }}>
            <Sidebar
                reportError={reportError}
                onOpen={openSidebar}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: landingPageHeight,
                }}
                data-testid="landingPage-not-sidebar"
                onClick={closeSidebar}
            >
                <Main open={isSidebarOpen}>
                    <Graph />
                </Main>
            </div>
        </div>
    );
};

LandingPage.propTypes = {
    reportError: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    openSidebar: PropTypes.func.isRequired,
};

export default LandingPage;
