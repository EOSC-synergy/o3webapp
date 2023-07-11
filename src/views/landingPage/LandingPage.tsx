import React, { FC } from 'react';
import Graph from './Graph';
import Sidebar from './Sidebar/Sidebar';
import { styled } from '@mui/material/styles';

/**
 * The width of the Drawer.
 *
 * @memberof LandingPage
 * @constant {int}
 * @default 400
 * @see {@link Sidebar}
 */
const drawerWidth = 400;

/**
 * Main component, that can be collapsed in order to see both the sidebar and the landing page next
 * to each other.
 *
 * @memberof LandingPage
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
 *
 * @param reportError Function to report an error
 * @param openSidebar Function to open the sidebar
 * @param closeSidebar Function to close the sidebar
 * @param isSidebarOpen Boolean to indicate whether the sidebar is open or not
 */
const LandingPage: FC<LandingPageProps> = ({
    reportError,
    openSidebar,
    closeSidebar,
    isSidebarOpen,
}) => {
    return (
        <>
            <Sidebar
                reportError={reportError}
                onOpen={openSidebar}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
            <Main open={isSidebarOpen}>
                <Graph reportError={reportError} />
            </Main>
        </>
    );
};

export default LandingPage;
