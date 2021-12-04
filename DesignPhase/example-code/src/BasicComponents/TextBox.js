import * as React from 'react';

export default function TextBox(props) {
    return (<div>
        <input type="text">{props.text}</input>
    </div>);
}