import * as React from 'react';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Graph from './views/landingPage/Graph';

/**
 * Main container of the Webapp
 * Contains all GUI elements
 */
export default function App() {

    return (<div>
        <NavBar />
        <Graph />
        <Footer />
    </div>);
}