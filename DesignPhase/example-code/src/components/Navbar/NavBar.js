import * as React from 'react';
import Button from '../views/landingPage/Sidebar/SectionComponents/inputs/Button';
import Sidebar from '../../views/landingPage/Sidebar/Sidebar';

/**
 * A component for the navigation of the website.
 */
export default function NavBar() {
    
    return (<div>
        <Button text="Edit Plot" onClick={props.handleSidebarOpen}/>
    </div>);
}