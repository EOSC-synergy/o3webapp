import * as React from 'react';
import ListBox from '../inputs/ListBox';
import TextBox from '../inputs/TextBox';
import RangeSlider from '../inputs/Slider/RangeSlider';
import defaultStructure from '../../../../config/defaultConfig.json';

export default function ApprearenceSection() {
    const [plotType, setPlotType] = useState("OCTS Plot")
    const [plotName, setPlotName] = useState("Name");

    const handlePlotNameChange = (event) => {
        setPlotName(event.target.value);
    };

    return <div>
        <ListBox text="Plot Type" items={["T", "O", "D", "O"]} selected={plotType} />
        <TextBox text="Plot Name" onChange={handlePlotNameChange}/>
        {defaultStructure.forEach(c => <>
            {/*Components from defaultStructure*/}
        </>)}
        {/*<RangeSlider />*/}
        {/*<RangeSlider />*/}
    </div>;
}