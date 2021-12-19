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
 *  props.open ->  whether sideBar should be open
 *  props.onClose -> handles closing of the sidebar
 *  props.error -> enables component to report an error
 * @returns {JSX} a jsx containing a sidebar with sections containing input components, a download button and a plotType dropdown
 */
function Sidebar(props) {

    const dispatch = useDispatch()
    let i = props.onClose;

    const [openDownloadModal, setOpenDownloadModal] = React.useState(false);
    const [expandedSection, setExpandedSection] = React.useState(null); // -> idx of sections array


    const [plotType, setPlotType] = React.useState("");

    /**
     * Changes the plot type and updates the sidebar according to new plot type
     * @param {String} newPlotType 
     */
    const changePlotType = (newPlotType) => {
        // check if newPlotType is valid
        // update plotType
        setPlotType(newPlotType);
        dispatch(setCurrentType(newPlotType))
        // rerender sections -> lose current value?
    }

    /**
     * closes the download modal
     */
    const onCloseDownloadModal = () => {
        setOpenDownloadModal(false);
    }

    /**
     * shows the download modal
     */
    const onOpenDownloadModal = () => {
        setOpenDownloadModal(true);
    }

    /**
     * collapses all sections
     */
    const onCollapseSection = () => {
        setExpandedSection(null);
    }

    /**
     * expands section with id (index in section array) i
     * collapses all other currently expanded sections
     * @param {int} i 
     */
    const onExpandSection = (i) => {
        setExpandedSection(i);
    }

    return (
    <>
        {props.open && 
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