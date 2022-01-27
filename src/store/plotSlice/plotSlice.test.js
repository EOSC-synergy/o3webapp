import reducer, 
{ 
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayXRange,
    setDisplayYRange,
    setMonths
} from "./plotSlice";

const definedInitialState = {
    
    plotId: "tco3_zm", // currently active plot
    // maps plotids to their settings
    settings: {
        "tco3_zm": {
            name: "OCTS", // should show up in the drop down menu
            title: "OCTS Plot", // the title shown in the apexcharts generated chart
            location: {
                minLat: -90,
                maxLat: 90
            },
            displayXRange: {
                minX: 1960,
                maxX: 2100,
            },
            displayYRange: {
                minY: 200,
                maxY: 400,
            },
            months: [
                1
            ],
        },
        "tco3_return": {
            name: "Return/Recovery",
            title: "Return/Recovery Plot",
            location: { // custom user defined region
                minLat: -90,
                maxLat: 90
            },
            displayXRange: {
                minX: 0,
                maxX: 0,
            },
            displayYRange: {
                minY: 200,
                maxY: 400,
            },
            months: [
                1
            ],
            regions: [
                0
            ],
        }
    }
};


test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      definedInitialState // Expect initial state to be the defined initial state
    );
});

test('should update the active plot id', () => {
    const previousState = {
        plotId: "tco3_zm"
    };

    const expected = { // expect changed plotId
        plotId: "tco3_return"
    };

    expect(
        reducer(
            previousState, 
            setActivePlotId({plotId: "tco3_return"}))
    ).toEqual(expected);
});

test('should update the title of the current active plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                title: "no title"
            }
        }
    };

    const expected = { // Expect the new state to have the new title
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                title: "OCTS Title"
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setTitle({title: "OCTS Title"}))
    ).toEqual(
        expected
    );
});

test('should update the location of the current active plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                location: {
                    minLat: 0,
                    maxLat: 0
                }
            }
        }
    };

    const expected = { // expect changed location
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                location: {
                    minLat: -90,
                    maxLat: 90
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setLocation({minLat: -90, maxLat: 90}))
    ).toEqual(expected);
});

test('should update the display x range of the current active plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                displayXRange: {
                    minX: 0,
                    maxX: 1000
                }
            }
        }
    };

    const expected = { // expect changed displayXRange
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                displayXRange: {
                    minX: 200,
                    maxX: 400
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setDisplayXRange({minX: 200, maxX: 400}))
    ).toEqual(expected);
});

test('should update the display y range of the current active plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                displayYRange: {
                    minY: 1000,
                    maxY: 2000
                }
            }
        }
    };

    const expected = { // expect changed displayYRange
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                displayYRange: {
                    minY: 1200,
                    maxY: 1400
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setDisplayYRange({minY: 1200, maxY: 1400}))
    ).toEqual(expected);
});

test('should update the selected months of the current active plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                months: [1]
            }
        }
    };

    const expected = { // expect changed months
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {
                months: [3, 4, 5]
            }
        }
    }
    
    expect(
        reducer(
            previousState, // use initial state 
            setMonths({months: [3, 4, 5]}))
    ).toEqual(expected);
});