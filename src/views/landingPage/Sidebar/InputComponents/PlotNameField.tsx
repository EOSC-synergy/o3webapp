import React, {
    type FC,
    type FocusEventHandler,
    type KeyboardEventHandler,
    type KeyboardEvent,
    useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlotId, selectPlotTitle, setTitle } from 'store/plotSlice';
import { Box, Divider, FormControl, TextField, Typography } from '@mui/material';

/**
 * The max. length of the plot name. Exported due to testing reasons.
 *
 * @memberof PlotNameField
 */
export const PLOT_NAME_MAX_LEN = 40;

/**
 * Enables the user to rename and change the plot title.
 *
 * @returns A jsx containing a text-field to change the plot name
 */
const PlotNameField: FC = () => {
    /**
     * The title that should be displayed above the TextField.
     *
     * @constant {String}
     * @default 'PLOT NAME'
     */
    const componentTitle = 'PLOT NAME';

    /**
     * The label displayed inside the TextField while nothing is typed in.
     *
     * @constant {String}
     * @default 'New Plot Name'
     */
    const textFieldLabel = 'New Plot Name';

    /**
     * Dispatcher to dispatch the plot name change action.
     *
     * @constant {function}
     */
    const dispatch = useDispatch();

    /**
     * The currently selected plotType. Taken from the redux store.
     *
     * @constant {String}
     * @see {@link selectPlotId}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * The current plot title from the store
     *
     * @constant {String}
     * @see {@link selectPlotTitle}
     */
    const plotTitle = useSelector(selectPlotTitle);

    useEffect(() => {
        // this might be done better but a controlled state throws a (yet) unsolvable redux error
        const textField = document.getElementById(
            'standard-basic-plot-title-input'
        ) as HTMLInputElement;
        textField.value = plotTitle;
    }, [plotId, plotTitle]);

    /**
     * Handles the change if the text in TextField is modified.
     *
     * @function
     * @param {Event} event The event that triggered the call of this event
     */
    const updatePlotName: FocusEventHandler<HTMLInputElement> &
        KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.value.length > PLOT_NAME_MAX_LEN) {
            event.currentTarget.value = event.currentTarget.value.slice(0, PLOT_NAME_MAX_LEN);
        }
        dispatch(setTitle({ title: event.currentTarget.value }));
    };
    return (
        <>
            <Divider>
                <Typography>{componentTitle}</Typography>
            </Divider>
            <Box
                sx={{
                    paddingLeft: '8%',
                    paddingRight: '8%',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                }}
            >
                <FormControl sx={{ width: '100%' }}>
                    <TextField
                        data-testid="plot-field"
                        id="standard-basic-plot-title-input"
                        label={textFieldLabel}
                        variant="standard"
                        defaultValue={plotTitle}
                        onBlur={updatePlotName}
                        onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                // TODO: why is this keyboardevent for a div by default?
                                updatePlotName(event as KeyboardEvent<HTMLInputElement>);
                            }
                        }}
                    />
                </FormControl>
            </Box>
        </>
    );
};

export default PlotNameField;
