import * as React from 'react';

export default function SingleSlider(props) {
    return (<div>
        <input type="range" min={props.min} max={props.max} value={props.value}></input>
    </div>);
}