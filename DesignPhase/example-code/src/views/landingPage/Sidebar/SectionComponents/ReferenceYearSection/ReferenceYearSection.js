import * as React from 'react';
import Button from '../inputs/Button';
import ListBox from '../inputs/ListBox';
import SingleSlider from '../inputs/Slider/SingleSlider';

export default function ReferenceYearSection() {
    const [offsetActive, setOffsetActive] = React.useState(false);
    const [referenceYear, setReferenceYear] = useState(2021);
    const [referenceModel, setReferenceModel] = useState("TODO");

    const handleApplyOffset = () => {
        setOffsetActive(true);
        // Apply offset with arithmetic class
        // Save data to Redux
    }
    const handleResetOffset = () => {
        setOffsetActive(false);
    }

    return (<div>
        <ListBox text="Reference Model" items={["T", "O", "D", "O"]} selected={referenceModel} />
        <SingleSlider min={1970} max={2100} value={referenceYear} />
        <Button text="Apply Offset" onClick={handleApplyOffset} />
        <Button text="Reset Offset" onClick={handleResetOffset} />
    </div>);
}