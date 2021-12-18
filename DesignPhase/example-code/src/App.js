import * as React from 'react';
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Graph from './views/landingPage/Graph/Graph';
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @returns a jsx containing all main components
 */
export default function App() {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [error, setError] = React.useState(null);  // error is used for errors in event handler functions

    const reportError = (msg) => {
        setError(msg);
    }
    
    const closeErrorModal = () => {
        setError(null);
    }
    
    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    }

    const handleSidebarClose = () => {
        setOpenSidebar(true);
    }
    

    return (
    <>
        <NavBar error={reportError} handleSidebarOpen={handleSidebarOpen} />
        <Graph error={reportError} />
        <Footer error={reportError} />
        <Sidebar error={reportError} open={openSidebar} onClose={handleSidebarClose} />
        <ErrorMessageModal open={error !== null} message={error} onClose={closeErrorModal} />
    </>
    );
}