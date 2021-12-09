import * as React from 'react';
import {Selector} from './BasicComponents'

export default function AddModelGroupPopUp() {

    return (<div>
        <Divider text="Select Name" />
        <TextBox text="" />
        <Divider text="Add new models" />
        <Selector />
    </div>);
}