import * as React from 'react';

export default function Divider(props) {
    return (<div>
        <p>{props.text}</p>
        <hr />
    </div>);
}