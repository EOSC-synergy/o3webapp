import reducer, {
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayYRange,
    setMonths,
    PlotState,
    setDisplayXRangeForPlot,
} from 'store/plotSlice';
import { O3AS_PLOTS } from 'utils/constants';

/*test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        initialState // Expect initial state to be the defined initial state
    );
});*/

test('should update the active plot id', () => {
    const previousState = {
        plotId: 'tco3_zm',
    } as PlotState;

    const expected = {
        // expect changed plotId
        plotId: 'tco3_return',
    };

    expect(reducer(previousState, setActivePlotId({ plotId: 'tco3_return' }))).toEqual(expected);
});

test('should update the title of the current active plot', () => {
    const previousState = {
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                title: 'no title',
            },
        },
    } as PlotState;

    const expected = {
        // Expect the new state to have the new title
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                title: 'OCTS Title',
            },
        },
    };

    expect(
        reducer(
            previousState, // use initial state
            setTitle({ title: 'OCTS Title' })
        )
    ).toEqual(expected);
});

test('should update the location of the current active plot', () => {
    const previousState = {
        generalSettings: {
            location: {
                minLat: 0,
                maxLat: 0,
            },
        },
    } as PlotState;

    const expected = {
        // expect changed location
        generalSettings: {
            location: {
                minLat: -90,
                maxLat: 90,
            },
        },
    };

    expect(
        reducer(
            previousState, // use initial state
            setLocation({ minLat: -90, maxLat: 90 })
        )
    ).toEqual(expected);
});

test('should update the display x range of the current active plot', () => {
    const previousState = {
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                displayXRange: {
                    years: {
                        minX: 0,
                        maxX: 1000,
                    },
                },
            },
        },
    } as PlotState;

    const expected = {
        // expect changed displayXRange
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                displayXRange: {
                    years: {
                        minX: 200,
                        maxX: 400,
                    },
                },
            },
        },
    };

    expect(
        reducer(
            previousState, // use initial state
            setDisplayXRangeForPlot({
                plotId: O3AS_PLOTS.tco3_zm,
                displayXRange: { years: { minX: 200, maxX: 400 } },
            })
        )
    ).toEqual(expected);
});

test('should update the display y range of the current active plot', () => {
    const previousState = {
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                displayYRange: {
                    minY: 1000,
                    maxY: 2000,
                },
            },
        },
    } as PlotState;

    const expected = {
        // expect changed displayYRange
        plotId: 'tco3_zm',
        plotSpecificSettings: {
            tco3_zm: {
                displayYRange: {
                    minY: 1200,
                    maxY: 1400,
                },
            },
        },
    };

    expect(
        reducer(
            previousState, // use initial state
            setDisplayYRange({ minY: 1200, maxY: 1400 })
        )
    ).toEqual(expected);
});

test('should update the selected months of the current active plot', () => {
    const previousState = {
        generalSettings: {
            months: [1],
        },
    } as PlotState;

    const expected = {
        // expect changed months
        generalSettings: {
            months: [3, 4, 5],
        },
    };

    expect(
        reducer(
            previousState, // use initial state
            setMonths({ months: [3, 4, 5] })
        )
    ).toEqual(expected);
});
