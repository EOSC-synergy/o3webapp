import * as React from 'react';
import {ListBox} from './BasicComponents'

export default function DownloadPopUp() {

    return (<div>
        <h1>Download Plot</h1>
        <ListBox text="Select Fromat" items={["T", "O", "D", "O"]}/>
    </div>);
}