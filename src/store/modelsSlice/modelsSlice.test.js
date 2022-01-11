import reducer, 
{

} from "./modelsSlice"

const definedInitialState = {
    // currently active plot
    plotId: "tco3_zm",
    settings: {
        "tco3_zm": { 
            // this objects holds key-value-pairs, the keys being the model-group 
            // identifier and the values being the settings for each group 
            "all": { 
                // model group storing all information until it is possible 
                // to implement more model groups
                name: "All OCTS models",
                modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
                models: { // models is lookup table
                    "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                        institute: "IMK",
                        dataset: {
                            x: [42],
                            y: [42],
                        },
                        color: "#000000",
                        plotStyle: "solid",
                        isVisible: true, // show/hide individual models from a group
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                    }
                },
                hidden: false, // show/hide complete group
                visibileSV: { // lookup table so the reducer impl. can be more convenient
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            }
        },
        "tco3_return": {
            "all": { 
                name: "All Return/Recovery models",
                modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
                models: { // models is lookup table
                    "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                        institute: "IMK",
                        dataset: {
                            x: [42],
                            y: [42],
                        },
                        hidden: false, // show/hide individual models from a group
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                        color: "#000000",
                        plotStyle: "solid",
                    }
                },
                hidden: false, // show/hide complete group
                visibileSV: { // lookup table so the reducer impl. can be more convenient
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            }
        }
    }
}

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      definedInitialState // Expect initial state to be the defined initial state
    );
});