import * as React from 'react';
import {Divider, ListBox} from './BasicComponents';
import {MultiCheckbox, SingleCheckbox} from './BasicComponents/Checkboxes';

export default function FilterDataSection() {
    return (<div>
        <Divider text="Location"/>
        <ListBox text="Location" items={["T", "O", "D", "O"]} />
        <Divider text="Time"/>
        <SingleCheckbox text="All Year"/>
        <MultiCheckbox />
        <MultiCheckbox />
        <MultiCheckbox />
        <MultiCheckbox />
    </div>);
}