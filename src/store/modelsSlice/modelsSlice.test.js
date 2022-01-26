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


describe("reducer test for modelsSlice", () => {
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
    
    

});
