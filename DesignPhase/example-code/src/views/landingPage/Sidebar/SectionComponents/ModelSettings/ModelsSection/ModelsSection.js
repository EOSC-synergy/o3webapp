import * as React from 'react';
import Button from '../../inputs/Button'

export default function ModelsSection() {
    const [modelGroups, setModelGroups] = React.useState(["All"])

    const onBtnClick = () => {
        return "TODO";
    }

    return (<div>
        <Button text="Add Model Group" onClick={onBtnClick} />
    </div>);
}