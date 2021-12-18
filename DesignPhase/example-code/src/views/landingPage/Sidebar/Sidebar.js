import * as React from 'react';
import Section from './Section/Section.js';
import defaultStructure from '../../../config/defaultConfig.json';
import DownloadModal from './DownloadModal/DownloadModal.js';

// /**
//  * opens a section specified by i
//  * @param {int} i the section number that should be opened
//  */
// function openSection(i) {
//     // TODO
// }

/**
 * Contains all input components responsible for the modification 
 * of the plot settings.
 * @param {*} props 
 *  props.open ->  whether sideBar should be open
 *  props.onClose -> handles closing of the sidebar
 *  props.error -> enables component to report an error
 * @returns 
 */
export default function Sidebar(props) {

    props.onClose;

    const [openDownloadModal, setOpenDownloadModal] = React.useState(false);
    const [expandedSection, setExpandedSection] = React.useState(null); // -> idx of sections array
    const [plotType, setPlotType] = React.useState(""); // -> evlt. über Redux?

    const onCloseDownloadModal = () => {
        setOpenDownloadModal(false);
    }

    const onOpenDownloadModal = () => {
        setOpenDownloadModal(true);
    }

    const onCollapseSection = () => {
        setExpandedSection(null);
    }

    const onExpandSection = (i) => {
        setExpandedSection(i);
    }

    const changePlotType = (newPlotType) => {
        // check if newPlotType is valid
        // update plotType
        setPlotType(newPlotType);
        // rerender sections -> lose current value?
    }

    return (<> {props.open && 
    <>
        <PlotTypeSelector plotType={plotType} changePlotType={changePlotType} />
        {/* {defaultStructure.forEach(s => <> */}
            <Section name={defaultStructure.sections[s].name} components={} />
        {/* </>)} */}

        {/* Maybe into their own component? */}
        <Button text="Download" onClick={onOpenDownloadModal}/>
        <DownloadModal open={openDownloadModal} onClose={onCloseDownloadModal} />
    </>
    } </>);
}