import * as React from 'react';
import Section from './Section/Section.js';
import defaultStructure from '../../../config/defaultConfig.json';
import DownloadModal from './DownloadModal/DownloadModal.js';
import { setCurrentType } from '../../../store/plotSlice.js';
import { useDispatch } from "react-redux";
import PlotTypeSelector from './InputComponents/PlotTypeSelector/PlotTypeSelector.js';

/**
 * Contains all input components responsible for the modification 
 * of the plot settings.
 * @param {Object} props 
 * @param {boolean} props.isOpen -  whether sideBar should be open
 * @param {function} props.onClose - handles closing of the sidebar
 * @param {function} props.reportError - enables component to report an error
 * @returns {JSX} a jsx containing a sidebar with sections containing input components, a download button and a plotType dropdown
 */
function Sidebar(props) {

    const dispatch = useDispatch()
    let i = props.onClose;
    i = props.reportError;
    i = props.isOpen;

    const [isDownloadModalVisible, setDownloadModalVisible] = React.useState(false);
    const [expandedSection, setExpandedSection] = React.useState(null); // -> idx of sections array

    /**
     * closes the download modal
     */
    const closeDownloadModal = () => {
        setOpenDownloadModal(false);
    }

    /**
     * shows the download modal
     */
    const openDownloadModal = () => {
        setOpenDownloadModal(true);
    }

    /**
     * collapses all sections
     */
    const collapseSection = () => {
        setExpandedSection(null);
    }

    /**
     * expands section with id (index in section array) i
     * collapses all other currently expanded sections
     * @param {int} i 
     */
    const expandSection = (i) => {
        setExpandedSection(i);
    }

    return (
    <>
        {props.isOpen && 
            <>

                <PlotTypeSelector plotType={plotType} />

                {defaultStructure.forEach((s, idx) =>
                    <Section
                        name={defaultStructure.sections[s].name}
                        open={expandedSection === idx}
                        components={"Empty for now"}
                        onCollapse={onCollapseSection}
                        onExpand={onExpandSection}
                    />
                )}

                {/* Maybe into their own component? */}
                {/* <Button text="Download" onClick={onOpenDownloadModal}/> */}
                <DownloadModal open={openDownloadModal} onClose={onCloseDownloadModal} />
            </>
        }
    </>);
}

export default Sidebar;