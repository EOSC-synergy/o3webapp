import React, { useState } from "react";

function mapNameToComponent(name) {
    return 0;
}

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @param {*} props 
 *  props.components -> an array containing a string representation of all components that should be plotted
 *  props.name -> the name of the section
 * @returns an accordeon that once expanded displays the components
 */
export default function Section(props) {
    
    const [expanded, setExpanded] = useState(true);
    props.components;
    props.name;

    return <div>
        {props.components.array.forEach(element => {
            mapNameToComponent(element);
        })}
    </div>;
}