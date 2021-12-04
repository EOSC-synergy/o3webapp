import * as React from 'react';
import {NavBar, Graph, Footer} from "./AppSubComponents"

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