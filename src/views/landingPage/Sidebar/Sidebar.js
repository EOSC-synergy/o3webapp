import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Section from './Section/Section.js';
import defaultStructure from '../../../config/defaultConfig.json';
import DownloadModal from './DownloadModal/DownloadModal.js';
import { setCurrentType } from '../../../store/plotSlice/plotSlice';
import { useDispatch } from "react-redux";
import PlotTypeSelector from './InputComponents/PlotTypeSelector/PlotTypeSelector.js';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

/**
 * Defining a drawerheader section at the beginning of a drawer
 */
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

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

    const theme = useTheme();

    // const dispatch = useDispatch()

    const [isDownloadModalVisible, setDownloadModalVisible] = React.useState(false);
    const [expandedSection, setExpandedSection] = React.useState(null); // -> idx of sections array

    /**
     * closes the download modal
     */
    const closeDownloadModal = () => {
        setDownloadModalVisible(false);
    }

    /**
     * shows the download modal
     */
    const openDownloadModal = () => {
        setDownloadModalVisible(true);
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
     * @param {int} i the section that should be expanded
     */
    const expandSection = (i) => {
        setExpandedSection(i);
    }

    return (
            <SwipeableDrawer
                anchor="right"
                open={props.isOpen}
                onClose={props.onClose}
                onOpen={props.onOpen}
                variant="persistent"
                sx= {{
                    width: 400,
                    maxWidth: "100vw",
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 400,
                        maxWidth: "100vw",
                    },
                }}
                data-testid="sidebar"
            >
                <DrawerHeader>
                    <IconButton
                        onClick={props.onClose}
                        data-testid="sidebarClose"
                    >
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>
                    <PlotTypeSelector />

                    {defaultStructure["sections"].map((s, idx) =>
                        <Section
                            name={s.name}
                            key={idx}
                            open={expandedSection === idx}
                            components={s.components}
                            onCollapse={collapseSection}
                            onExpand={expandSection}
                        />
                    )}

                    <Button sx={{marginLeft: "10%", marginTop: "1em", width: "80%"}} variant="outlined" onClick={openDownloadModal}>Download</Button>
                    <DownloadModal isOpen={isDownloadModalVisible} onClose={closeDownloadModal} />
        </SwipeableDrawer>
    );
}

export default Sidebar;