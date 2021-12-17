import * as React from 'react';
import AppearenceSection from './InputComponents/AppearenceSection/AppearenceSection';
import FilterDataSection from './InputComponents/FilterDataSection/FilterDataSection';
import ModelsSection from './InputComponents/ModelsSection/ModelsSection';
import ReferenceYearSection from './InputComponents/ReferenceYearSection/ReferenceYearSection';
import Button from './InputComponents/inputs/Button';

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