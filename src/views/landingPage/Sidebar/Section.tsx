import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomLatitudeSelector from './InputComponents/LatitudeBandSelector/CustomLatitudeSelector';
import LatitudeBandSelector from './InputComponents/LatitudeBandSelector';
import LocationSelector from './InputComponents/LatitudeBandSelector';
import ModelGroupConfigurator from './InputComponents/ModelGroupConfigurator';
import PlotNameField from './InputComponents/PlotNameField';
import ReferenceModelSelector from './InputComponents/ReferenceModelSelector';
import ReferenceYearField from './InputComponents/ReferenceYearField';
import RegionSelector from './InputComponents/RegionSelector';
import TimeCheckBoxGroup from './InputComponents/TimeCheckboxGroup';
import XAxisField from './InputComponents/XAxisField';
import YAxisField from './InputComponents/YAxisField';
import { type ErrorReporter } from 'utils/reportError';

/**
 * Stores the name of the CustomLatitudeSelector component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const CLS_Symbol = Symbol('CustomLatitudeSelector');

/**
 * Stores the name of the LatitudeBandSelector component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const LBS_Symbol = Symbol('LatitudeBandSelector');

/**
 * Stores the name of the LocationSelector component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const LS_Symbol = Symbol('LocationSelector');

/**
 * Stores the name of the ModelGroupConfigurator component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const MGC_Symbol = Symbol('ModelGroupConfigurator');

/**
 * Stores the name of the PlotNameField component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const PNF_Symbol = Symbol('PlotNameField');

/**
 * Stores the name of the ReferenceModelSelector component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const RMS_Symbol = Symbol('ReferenceModelSelector');

/**
 * Stores the name of the ReferenceYearField component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const RYF_Symbol = Symbol('ReferenceYearField');

/**
 * Stores the name of the RegionSelector component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const RS_Symbol = Symbol('RegionSelector');

/**
 * Stores the name of the TimeCheckBoxGroup component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const TCG_Symbol = Symbol('TimeCheckBoxGroup');

/**
 * Stores the name of the XAxisField component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const XAF_Symbol = Symbol('XAxisField');

/**
 * Stores the name of the YAxisField component as a Symbol.
 *
 * @memberof Section
 * @constant {String}
 */
const YAF_Symbol = Symbol('YAxisField');

/**
 * Custom Accordion component inspired by:
 * {@link https://mui.com/components/accordion/#customization}
 *
 * @memberof Section
 * @constant {JSX.Element}
 */
const Accordion = styled((props: Parameters<typeof MuiAccordion>[0] /* type of props param */) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

/**
 * Custom Accordion summary component
 *
 * @memberof Section
 * @constant {JSX.Element}
 */
const AccordionSummary = styled(
    (props: Parameters<typeof MuiAccordionSummary>[0] /* type of props param */) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
            {...props}
        />
    )
)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

/**
 * Custom AccordionDetails component
 *
 * @memberof Section
 * @constant {JSX.Element}
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type SectionProps = {
    components: string[];
    name: string;
    reportError: ErrorReporter;
};

/**
 * An expandable section containing a list of inputComponents as well as a name
 *
 * @param components -> an array containing a string representation of all components that should be
 *   plotted
 * @param name -> the name of the section
 * @param reportError -> used for error handling
 * @returns An accordion that once expanded displays the components specified by the config files
 *   and the API doc
 * @component
 */
const Section: React.FC<SectionProps> = ({ components, name, reportError }) => {
    /**
     * Maps a given name to a corresponding component from the ./InputComponents folder if there is
     * no component with the given name, calls the props.reportError function
     *
     * @param name_ The name of the component
     * @param key A unique key for the given input component
     * @returns {JSX.Element} A component from './InputComponents
     * @public
     */
    function mapNameToComponent(name_: string, key: number) {
        if (reportError !== undefined) {
            switch (name_) {
                case CLS_Symbol.description:
                    return <CustomLatitudeSelector key={key} />;
                case LBS_Symbol.description:
                    return <LatitudeBandSelector key={key} />;
                case LS_Symbol.description:
                    return <LocationSelector key={key} />;
                case MGC_Symbol.description:
                    return <ModelGroupConfigurator key={key} reportError={reportError} />;
                case PNF_Symbol.description:
                    return <PlotNameField key={key} />;
                case RMS_Symbol.description:
                    return <ReferenceModelSelector key={key} reportError={reportError} />;
                case RYF_Symbol.description:
                    return <ReferenceYearField key={key} />;
                case RS_Symbol.description:
                    return <RegionSelector key={key} />;
                case TCG_Symbol.description:
                    return <TimeCheckBoxGroup key={key} />;
                case XAF_Symbol.description:
                    return <XAxisField key={key} />;
                case YAF_Symbol.description:
                    return <YAxisField key={key} reportError={reportError} />;
                default:
                    reportError(`Section ${name} found no match for an input component ${name_}`);
            }
        } else {
            return <> `props.ReportError` not defined </>;
        }
    }

    if (!components || components.length === 0) {
        if (reportError !== undefined) {
            reportError(`Section ${name} was provided with no components`);
            return <></>;
        } else {
            return <> `props.ReportError` not defined </>;
        }
    }

    return (
        <Accordion
            data-testid={`Section-${name}`}
            sx={{
                maxWidth: '100vw', // make sure accordion is not wider than the full screen
            }}
            //expanded={isExpanded}
            //onChange={isExpanded ? onCollapse : onExpand}
        >
            <AccordionSummary
                //expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                //id="panel1a-header"
                data-testid={`Section-Summary-${name}`}
            >
                <Typography>{name.toUpperCase()}</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <>
                    {components.map((element, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {mapNameToComponent(element, idx)}
                                {idx !== components.length - 1 && (
                                    <div style={{ height: '20px' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            </AccordionDetails>
        </Accordion>
    );
};

export default Section;
