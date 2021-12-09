import * as React from 'react';

export default function SingleCheckbox(props) {
    return (<div>
        <input type="checkbox" name={props.text} />
    </div>);
}