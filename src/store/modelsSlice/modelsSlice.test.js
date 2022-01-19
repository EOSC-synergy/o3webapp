import reducer, 
{
    addModels,
    removeModels,
    updatedModelGroup,  // not impl. yet
    addedModelGroup,    // not impl. yet
    setVisibility, 
    setStatisticalValueIncluded, 
    setStatisticalValueForGroup
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


test('should remove the model list of the current plot', () => {
    
    const removeModelList = ["modelA", "modelB", "modelC"]
    
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {  
                all: {
                    modelList: removeModelList,
                    models: {
                        modelA: "dataA",
                        modelB: "dataB",
                        modelC: "dataC",
                    }
                }
            }
        }
    };

    const expected = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {  
                "all": {
                    modelList: [],
                    models: {
                        // expect lookup table to be empty
                    }
                }
            }
        }
    };

    expect(
        reducer(previousState, removeModels({groupId: "all", removeModelList: removeModelList}))
    ).toEqual(expected);

});

test('should add the model list of the current plot', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {  
                all: {
                    modelList: [],
                }
            }
        }
    };

    const newModels = ["modelA", "modelB", "modelC"]

    const expected = {
        plotId: "tco3_zm",
        settings: {
            "tco3_zm": {  
                "all": {
                    modelList: newModels,
                }
            }
        }
    };

    expect(
        reducer(previousState, addModels({groupId: "all", newModelList: newModels}))
    ).toEqual(expected);

});


test('should update the visibility of the given model in the given group', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    models: {
                        modelA: {
                            isVisible: true
                        }
                    }
                }
            }
        }
    };

    const expected = { // Expect the new state to have the updated visibility of modelA
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    models: {
                        modelA: {
                            isVisible: false
                        }
                    }
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setVisibility({groupID: "all", modelID: "modelA", isVisible: false})
        )
    ).toEqual(
        expected
    );
});


test('should update that the given model in the given group is now included in the given SV', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    models: {
                        modelA: {
                            mean: false
                        }
                    }
                }
            }
        }
    };

    const expected = { // Expect the new state to have the updated visibility of modelA
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    models: {
                        modelA: {
                            mean: true
                        }
                    }
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setStatisticalValueIncluded({groupID: "all", modelID: "modelA", svType: "mean", isIncluded: true})
        )
    ).toEqual(
        expected
    );
});

test('should update that the given model in the given group is now included in the given SV', () => {
    const previousState = {
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    visibileSV: {
                        mean: false
                    }
                }
            }
        }
    };

    const expected = { // Expect the new state to have the updated visibility of modelA
        plotId: "tco3_zm",
        settings: {
            tco3_zm: {
                all: {
                    visibileSV: {
                        mean: true
                    }
                }
            }
        }
    };
    
    expect(
        reducer(
            previousState, // use initial state 
            setStatisticalValueForGroup({groupID: "all", svType: "mean", isIncluded: true})
        )
    ).toEqual(
        expected
    );
});