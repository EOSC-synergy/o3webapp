import React, { useState } from "react";

function mapNameToComponent(name) {
    return 0;
}

export default function Section(props) {
    
    const [expanded, setExpanded] = useState(true);
    props.components;

    return <div>
        {props.components.array.forEach(element => {
            mapNameToComponent(element);
        })}
    </div>;
}