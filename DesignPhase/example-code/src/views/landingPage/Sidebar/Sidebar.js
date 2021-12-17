import * as React from 'react';
import Section from './Section/Section.js';
import defaultStructure from '../../../config/defaultConfig.json';

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
        {defaultStructure.forEach(s => <>
            <Section name={defaultStructure.sections[s].name} />
        </>)}
        <Button text="Download" onClick={openDownloadModal}/>
    </div>)
    } </>);
}