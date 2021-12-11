import * as React from 'react';
import {Selector} from './BasicComponents'

export default function AddModelGroupPopUp() {
    const [open, setOpen] = useState(false);

    return (<>{open && <div>
        <Divider text="Select Name" />
        <TextBox text="" />
        <Divider text="Add new models" />
        <Selector />
    </div>}</>);
}