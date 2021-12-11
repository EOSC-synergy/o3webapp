import * as React from 'react';
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Graph from './views/landingPage/Graph/Graph';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 */
export default function App() {
    const [open, setOpen] = React.useState(false);

    return (<div>
        <NavBar />
        <Graph />
        <Footer />
        <Sidebar open={open} />
    </div>);
}