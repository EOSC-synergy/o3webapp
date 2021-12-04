import * as React from 'react';
import {ApprearenceSection, FilterDataSection, ModelsSection, ReferenceYearSection} from './AppSubComponents/SectionComponents';
import {Button} from './BasicComponents'

function downloadHandler() {
    return "TODO";
}


export default function Sidebar(props) {
    return (<div> {props.open && 
    (<div>
        <ApprearenceSection />
        <ModelsSection />
        <FilterDataSection />
        <ReferenceYearSection />
        <Button text="Download" onClick={downloadHandler}/>
    </div>)
    }</div>);
}