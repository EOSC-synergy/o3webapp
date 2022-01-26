import reducer, 
{
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
    deleteModelGroup,
    updatePropertiesOfModelGroup,
} from "./modelsSlice"

const MODEL_DATA_TEMPLATE = {   
    color: null,                
    isVisible: true,          
    mean: true,
    derivative: true,
    median: true,
    percentile: true,
}

test('should edit the model list of the given group', () => {
    
    const newModelList = ["modelB", "modelC"]
    
    const previousState = {
        modelGroupList: ["group1", "group2"],
        modelGroups: {
            group1: {
                modelList: ["modelA", "modelB"],
                models: {
                    modelA: "dataA",
                    modelB: "dataB",
                },
            },
            group2: {
                modelList: ["dataD", "dataE", "dataF"],
                models: {
                    modelA: "dataD",
                    modelB: "dataE",
                    modelC: "dataF",
                },
            },
        },
    };

    const expected = {
        modelGroupList: ["group1", "group2"],
        modelGroups: {
            group1: {
                modelList: ["modelB", "modelC"], // empty
                models: {
                    modelB: "dataB",
                    modelC: MODEL_DATA_TEMPLATE,
                }, // empty
            },
            group2: {
                modelList: ["dataD", "dataE", "dataF"],
                models: {
                    modelA: "dataD",
                    modelB: "dataE",
                    modelC: "dataF",
                },
            },
        },
    };

    expect(
        reducer(previousState, setModelsOfModelGroup({groupId: "group1", modelList: newModelList}))
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