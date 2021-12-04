import * as React from 'react';
import Button from '../BasicComponents/Button';
import Sidebar from './Sidebar';

/**
 * A component for the navigation of the website.
 */
export default function NavBar() {

    const [open, setOpen] = React.useState(false);

    const drawerToggle = () => {
        setOpen(!open);
    }
    
    return (<div>
        <Sidebar open={open} />
        <Button text="Edit Plot" onClick={drawerToggle}/>
    </div>);
}