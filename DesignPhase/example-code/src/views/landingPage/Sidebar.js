import * as React from 'react';
import AppearenceSection from './SectionComponents/AppearenceSection';
import FilterDataSection from './SectionComponents/FilterDataSection';
import ModelsSection from './SectionComponents/ModelsSection';
import ReferenceYearSection from './SectionComponents/ReferenceYearSection';
import Button from './SectionComponents/inputs/Button';

function downloadHandler() {
    return "TODO";
}


/**
 * Contains all components
 * responsible for the modification 
 * of the plot settings.
 */
export default function Sidebar(props) {
    return (<> {props.open && 
    (<div>
        <AppearenceSection />
        <ModelsSection />
        <FilterDataSection />
        <ReferenceYearSection />
        <Button text="Download" onClick={downloadHandler}/>
    </div>)
    } </>);
}