import React, { type FC, useMemo, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Section from './Section';
import defaultStructure from 'config/defaultSections';
import tco3_zm from 'config/tco3_zm';
import tco3_return from 'config/tco3_return';
import DownloadModal from './DownloadModal';
import { selectPlotId } from 'store/plotSlice';
import { useSelector } from 'react-redux';
import PlotTypeSelector from './InputComponents/PlotTypeSelector';
import { Button, Divider, SwipeableDrawer, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { BACKGROUND_BASE_COLOR, O3AS_PLOTS } from 'utils/constants';
import { type ErrorReporter } from 'utils/reportError';

export const DRAWER_WIDTH = 400;

/**
 * Defining a drawer-header section at the beginning of a drawer
 *
 * @memberof Sidebar
 * @constant {JSX.Element}
 */
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    backgroundColor: BACKGROUND_BASE_COLOR,
}));

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    reportError: ErrorReporter;
    onOpen: () => void;
};
/**
 * Contains all input components responsible for the modification of the plot settings.
 *
 * @param isOpen - Whether sideBar should be open
 * @param onClose - Handles closing of the sidebar
 * @param reportError - Enables component to report an error
 * @param onOpen - Handles opening of the sidebar
 * @returns A jsx containing a sidebar with sections containing input components, a download button
 *   and a plotType dropdown
 * @component
 */
const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, reportError, onOpen }) => {
    const theme = useTheme();

    const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState<number | null>(null); // -> idx of sections array

    const closeDownloadModal = () => {
        setDownloadModalVisible(false);
    };

    const openDownloadModal = () => {
        setDownloadModalVisible(true);
    };

    const collapseSection = () => {
        setExpandedSection(null);
    };

    const expandSection = (index: number) => {
        setExpandedSection(index);
    };

    const selectedPlot = useSelector(selectPlotId);

    /**
     * Creates the structure of the sections depending on the type of plot and the config file.
     *
     * @function
     */
    const sectionStructure = useMemo(() => {
        const sections = [...defaultStructure['sections']];
        let specificSections;
        switch (selectedPlot) {
            case O3AS_PLOTS.tco3_zm:
                specificSections = tco3_zm['sections'];
                break;
            case O3AS_PLOTS.tco3_return:
                specificSections = tco3_return['sections'];
                break;
            default:
                reportError('Invalid plot type.');
                return [];
        }
        for (const specific of specificSections) {
            const index = sections.findIndex((section) => section.name === specific.name);
            if (index === -1) {
                sections.push(specific);
            } else {
                sections[index] = specific;
            }
        }
        return sections;
    }, [selectedPlot]);

    return (
        <SwipeableDrawer
            anchor="right"
            variant="persistent"
            open={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    backgroundColor: BACKGROUND_BASE_COLOR,
                    boxSizing: 'border-box',
                },
            }}
            data-testid="sidebar"
        >
            <DrawerHeader>
                <IconButton onClick={onClose} data-testid="sidebarClose">
                    <CloseIcon />
                </IconButton>
            </DrawerHeader>

            <div>
                <Divider>
                    <Typography>SELECT PLOT TYPE</Typography>
                </Divider>
            </div>

            <PlotTypeSelector reportError={reportError} />

            <div style={{ marginBottom: '2%' }}>
                <Divider>
                    <Typography>CONFIGURE PLOT</Typography>
                </Divider>
            </div>

            {sectionStructure.map((s) => (
                <div
                    key={s.name}
                    style={{
                        width: '95%',
                        marginBottom: '2%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <Section
                        name={s.name}
                        //isExpanded={idx === expandedSection}
                        components={s.components}
                        //onCollapse={() => collapseSection()}
                        //onExpand={() => expandSection(idx)}
                        reportError={reportError}
                    />
                </div>
            ))}
            <Button
                startIcon={<FileDownloadIcon />}
                variant="contained"
                //position="fixed"
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    width: DRAWER_WIDTH + 1,
                    backgroundColor: theme.palette.primary.light,
                    height: '8%',
                    borderRadius: 0,
                }}
                //elevation={3}
                onClick={openDownloadModal}
            >
                Download
            </Button>
            <DownloadModal
                reportError={reportError}
                isOpen={isDownloadModalVisible}
                onClose={closeDownloadModal}
            />
        </SwipeableDrawer>
    );
};

export default Sidebar;
