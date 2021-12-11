import * as React from 'react';
import Divider from '../inputs/Divider';
import ListBox from '../inputs/ListBox';
import MultiCheckbox from '../inputs/Checkboxes/MultiCheckBox';
import SingleCheckbox from '../inputs/Checkboxes/SingleCheckBox';

export default function FilterDataSection() {
    const [selectedLocation, setSelectedLocation] = React.useState("Uganda");
    const [selectedMonths, setSelectedMonths] = React.useState([])

    return (<div>
        <Divider text="Location"/>
        <ListBox text="Location" items={["T", "O", "D", "O"]} selected={selectedLocation} />
        <Divider text="Time"/>
        <SingleCheckbox text="All Year"/>
        <MultiCheckbox />
        <MultiCheckbox />
        <MultiCheckbox />
        <MultiCheckbox />
    </div>);
}