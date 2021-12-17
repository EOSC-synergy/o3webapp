import * as React from 'react';
import AppearenceSection from './SectionComponents/AppearenceSection/AppearenceSection';
import FilterDataSection from './SectionComponents/FilterDataSection/FilterDataSection';
import ModelsSection from './SectionComponents/ModelsSection/ModelsSection';
import ReferenceYearSection from './SectionComponents/ReferenceYearSection/ReferenceYearSection';
import Button from './SectionComponents/inputs/Button';

/**
 * opens the downloadModal
 */
function openDownloadModal() {
    // TODO
}

/**
 * opens a section specified by i
 * @param {int} i the section number that should be opened
 */
function openSection(i) {
    // TODO
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
        
        <Button text="Download" onClick={openDownloadModal}/>
    </div>)
    } </>);
}