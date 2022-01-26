import reducer, 
{
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
    deleteModelGroup,
    updatePropertiesOfModelGroup,
    STATISTICAL_VALUES,
} from "./modelsSlice"

const MODEL_DATA_TEMPLATE = {   
    color: null,                
    isVisible: true,          
    mean: true,
    derivative: true,
    median: true,
    percentile: true,
}


describe("reducer tests", () => {

    it('should edit the model list of the given group and leave other groups untoched', () => {
    
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
    
    it('should create a new group if the given id is not present and increment the id counter', () => {
        
        const newModelList = ["modelA", "modelB"]
        
        const previousState = {
            idCounter: 0,
            modelGroupList: [],
            modelGroups: {
                
            },
        };
    
        const expected = {
            idCounter: 1,
            modelGroupList: [0],
            modelGroups: {
                0: {
                    name: "fancy",
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: MODEL_DATA_TEMPLATE,
                        modelB: MODEL_DATA_TEMPLATE,
                    },
                    isVisible: true,    // show/hide complete group
                    visibileSV: {       // lookup table so the reducer impl. can be more convenient
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                    }
                },
            },
        };
    
        expect(
            reducer(previousState, setModelsOfModelGroup({groupName: "fancy", modelList: newModelList}))
        ).toEqual(expected);
    
    });
    
    it('should update the visibility of the given model in the given group', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: "dataA",
                        modelB: "dataB",
                    },
                    isVisible: false,
                },
            },
        };
    
        const expected = { // Expect the new state to have the updated visibility of modelA
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: "dataA",
                        modelB: "dataB",
                    },
                    isVisible: true,
                },
            },
        };
        
        expect(
            reducer(
                previousState, // use initial state 
                setVisibilityForGroup({groupId: 0, isVisible: true})
            )
        ).toEqual(
            expected
        );
    });
    
    it('should delete the given model group', () => {
        const previousState = {
            modelGroupList: [0, 1],
            modelGroups: {
                0: {
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: "dataA",
                        modelB: "dataB",
                    },
                    isVisible: false,
                },
                1: {
                    modelList: ["modelC", "modelD"],
                    models: {
                        modelA: "dataC",
                        modelB: "dataD",
                    },
                    isVisible: false,
                },
            },
        };

        const expected = {
            modelGroupList: [1],
            modelGroups: {
                1: {
                    modelList: ["modelC", "modelD"],
                    models: {
                        modelA: "dataC",
                        modelB: "dataD",
                    },
                    isVisible: false,
                },
            },
        };

        expect(
            reducer(
                previousState,
                deleteModelGroup({groupId: 0}),
            )
        ).toEqual(expected);

    });

    it('should update the properties of the model group accordingly', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: {   
                            color: null,              
                            isVisible: false,          
                            mean: true,
                            derivative: true,
                            median: true,
                            percentile: true,
                        },
                        modelB: {   
                            color: null,              
                            isVisible: true,          
                            mean: false,
                            derivative: false,
                            median: false,
                            percentile: false,
                        },
                    },
                },
            },
        };

        const expected = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ["modelA", "modelB"],
                    models: {
                        modelA: {   
                            color: null,              
                            isVisible: true,          
                            mean: false,
                            derivative: false,
                            median: false,
                            percentile: false,
                        },
                        modelB: {   
                            color: null,              
                            isVisible: false,          
                            mean: true,
                            derivative: true,
                            median: true,
                            percentile: true,
                        },
                    },
                },
            },
        };
        
        const data = {
            modelA: {   
                color: null,              
                isVisible: true,          
                mean: false,
                derivative: false,
                median: false,
                percentile: false,
            },
            modelB: {   
                color: null,              
                isVisible: false,          
                mean: true,
                derivative: true,
                median: true,
                percentile: true,
            },
        };


        expect(reducer(previousState, updatePropertiesOfModelGroup({
                    groupId: 0,
                    data,
                })
            )).toEqual(expected);
    });

    it('should set the statistical value for the given group correct', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: [],
                    models: {},
                    visibileSV: {
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                    }
                },
            },
        };

        const expected = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: [],
                    models: {},
                    visibileSV: {
                        mean: false,
                        derivative: true,
                        median: true,
                        percentile: true,
                    }
                },
            },
        };

        expect(
            reducer(
                previousState,
                setStatisticalValueForGroup({groupId: 0, svType: STATISTICAL_VALUES.mean, isIncluded: false})
            )
        ).toEqual(expected);

        
    });

});

describe("selector tests", () => {
    
    it('should select the correct model list', () => {
        const globalState = {
            models: {
                modelGroupList: ["group1"],
                modelGroups: {
                    group1: {
                        modelList: ["modelA", "modelB"],
                        models: {
                            modelA: "dataA",
                            modelB: "dataB",
                        },
                    },
                },
            },
        };
    });

    it('should select the correct model data', () => {

    });

    it('should select the corret name', () => {

    });





});
