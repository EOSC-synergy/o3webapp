import * as React from 'react';
import Divider from './inputs/Divider';
import ListBox from './inputs/ListBox';
import MultiCheckbox from './inputs/Checkboxes/MultiCheckBox';
import SingleCheckbox from './inputs/Checkboxes/SingleCheckBox';

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