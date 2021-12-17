import React, { useState } from "react";
import ListBox from '../inputs/ListBox';
import TextBox from '../inputs/TextBox';
import defaultStructure from '../../../../config/defaultConfig.json';

function mapNameToComponent(name) {
    return 0;
}

export default function Section(props) {
    
    const [expanded, setExpanded] = useState(true);
    props.components;

    return <div>
        <ListBox text="Plot Type" items={["T", "O", "D", "O"]} selected={plotType} />
        <TextBox text="Plot Name" onChange={handlePlotNameChange}/>
        {props.components.array.forEach(element => {
            mapNameToComponent(element);
        })}

        {defaultStructure.forEach(c => <>
            {/*Components from defaultStructure*/}
        </>)}
    </div>;
}