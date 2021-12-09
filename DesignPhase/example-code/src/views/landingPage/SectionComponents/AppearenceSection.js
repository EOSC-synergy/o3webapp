import * as React from 'react';
import {ListBox, TextBox, RangeSlider} from "./BasicComponents"

export default function ApprearenceSection() {
    return <div>
        <ListBox text="Plot Type" items={["T", "O", "D", "O"]} />
        <TextBox text="Plot Name" />
        <RangeSlider />
        <RangeSlider />
    </div>;
}