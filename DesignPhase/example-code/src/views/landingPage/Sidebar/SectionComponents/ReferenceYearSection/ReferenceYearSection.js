import * as React from 'react';
import ListBox from '../inputs/ListBox';
import SingleSlider from '../inputs/Slider/SingleSlider';

export default function ReferenceYearSection() {
    return (<div>
        <ListBox text="Location" items={["T", "O", "D", "O"]}/>
        <SingleSlider min={1970} max={2100} value={2021} />
    </div>);
}