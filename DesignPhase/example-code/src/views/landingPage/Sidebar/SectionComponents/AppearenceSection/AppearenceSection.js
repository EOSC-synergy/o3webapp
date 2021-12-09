import * as React from 'react';
import ListBox from '../inputs/ListBox';
import TextBox from '../inputs/TextBox';
import RangeSlider from '../inputs/Slider/RangeSlider';

export default function ApprearenceSection() {
    return <div>
        <ListBox text="Plot Type" items={["T", "O", "D", "O"]} />
        <TextBox text="Plot Name" />
        <RangeSlider />
        <RangeSlider />
    </div>;
}