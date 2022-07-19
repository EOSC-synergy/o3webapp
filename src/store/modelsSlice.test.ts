import reducer, {
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
    deleteModelGroup,
    updatePropertiesOfModelGroup,
    selectAllGroupIds,
    selectModelsOfGroup,
    selectModelDataOfGroup,
    selectNameOfGroup,
    selectStatisticalValueSettingsOfGroup,
    selectVisibilityOfGroup,
    MODEL_DATA_TEMPLATE,
    ModelState,
    GlobalModelState,
} from './modelsSlice';
import { mean, STATISTICAL_VALUES_LIST } from 'utils/constants';

describe('reducer tests', () => {
    it('should edit the model list of the given group and leave other groups untouched', () => {
        const newModelList = ['modelB', 'modelC'];

        const previousState = {
            modelGroups: {
                group1: {
                    models: {
                        modelA: 'dataA',
                        modelB: 'dataB',
                    },
                },
                group2: {
                    models: {
                        modelA: 'dataD',
                        modelB: 'dataE',
                        modelC: 'dataF',
                    },
                },
            },
        } as unknown as ModelState;

        const expected = {
            modelGroups: {
                group1: {
                    models: {
                        modelB: 'dataB',
                        modelC: MODEL_DATA_TEMPLATE,
                    }, // empty
                    name: 'newName',
                },
                group2: {
                    models: {
                        modelA: 'dataD',
                        modelB: 'dataE',
                        modelC: 'dataF',
                    },
                },
            },
        };

        expect(
            reducer(
                previousState,
                setModelsOfModelGroup({
                    groupId: 'group1',
                    groupName: 'newName',
                    modelList: newModelList,
                })
            )
        ).toEqual(expected);
    });

    it('should create a new group if the given id is not present and increment the id counter', () => {
        const newModelList = ['modelA', 'modelB'];

        const previousState = {
            idCounter: 0,
            modelGroups: {},
        };

        const visibleSV = STATISTICAL_VALUES_LIST.reduce((p, c) => {
            return { ...p, [c]: true };
        }, {});

        const expected = {
            idCounter: 1,
            modelGroups: {
                0: {
                    name: 'fancy',
                    models: {
                        modelA: MODEL_DATA_TEMPLATE,
                        modelB: MODEL_DATA_TEMPLATE,
                    },
                    isVisible: true, // show/hide complete group
                    visibleSV,
                },
            },
        };

        expect(
            reducer(
                previousState,
                setModelsOfModelGroup({ groupName: 'fancy', modelList: newModelList })
            )
        ).toEqual(expected);
    });

    it('should update the visibility of the given model in the given group', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ['modelA', 'modelB'],
                    models: {
                        modelA: 'dataA',
                        modelB: 'dataB',
                    },
                    isVisible: false,
                },
            },
        } as unknown as ModelState;

        const expected = {
            // Expect the new state to have the updated visibility of modelA
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ['modelA', 'modelB'],
                    models: {
                        modelA: 'dataA',
                        modelB: 'dataB',
                    },
                    isVisible: true,
                },
            },
        };

        expect(
            reducer(
                previousState, // use initial state
                setVisibilityForGroup({ groupId: 0, isVisible: true })
            )
        ).toEqual(expected);
    });

    it('should delete the given model group', () => {
        const previousState = {
            modelGroups: {
                0: {
                    modelList: ['modelA', 'modelB'],
                    models: {
                        modelA: 'dataA',
                        modelB: 'dataB',
                    },
                    isVisible: false,
                },
                1: {
                    modelList: ['modelC', 'modelD'],
                    models: {
                        modelA: 'dataC',
                        modelB: 'dataD',
                    },
                    isVisible: false,
                },
            },
        } as unknown as ModelState;

        const expected = {
            modelGroups: {
                1: {
                    modelList: ['modelC', 'modelD'],
                    models: {
                        modelA: 'dataC',
                        modelB: 'dataD',
                    },
                    isVisible: false,
                },
            },
        };

        expect(reducer(previousState, deleteModelGroup({ groupId: 0 }))).toEqual(expected);
    });

    it('should update the properties of the model group accordingly', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ['modelA', 'modelB'],
                    models: {
                        modelA: {
                            color: null,
                            isVisible: false,
                            mean: true,
                            std: true,
                            median: true,
                            percentile: true,
                        },
                        modelB: {
                            color: null,
                            isVisible: true,
                            mean: false,
                            std: false,
                            median: false,
                            percentile: false,
                        },
                    },
                },
            },
        } as unknown as ModelState;

        const expected = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: ['modelA', 'modelB'],
                    models: {
                        modelA: {
                            color: null,
                            isVisible: true,
                            mean: false,
                            'standard deviation': false,
                            median: false,
                            percentile: false,
                        },
                        modelB: {
                            color: null,
                            isVisible: false,
                            mean: true,
                            'standard deviation': true,
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
                'standard deviation': false,
                median: false,
                percentile: false,
            },
            modelB: {
                color: null,
                isVisible: false,
                mean: true,
                'standard deviation': true,
                median: true,
                percentile: true,
            },
        };

        expect(
            reducer(
                previousState,
                updatePropertiesOfModelGroup({
                    groupId: 0,
                    data,
                })
            )
        ).toEqual(expected);
    });

    it('should set the statistical value for the given group correct', () => {
        const previousState = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: [],
                    models: {},
                    visibleSV: {
                        mean: true,
                        std: true,
                        median: true,
                        percentile: true,
                    },
                },
            },
        } as unknown as ModelState;

        const expected = {
            modelGroupList: [0],
            modelGroups: {
                0: {
                    modelList: [],
                    models: {},
                    visibleSV: {
                        mean: false,
                        std: true,
                        median: true,
                        percentile: true,
                    },
                },
            },
        };

        expect(
            reducer(
                previousState,
                setStatisticalValueForGroup({ groupId: 0, svType: mean, isIncluded: false })
            )
        ).toEqual(expected);
    });
});

describe('selector tests', () => {
    it('should select the model list', () => {
        const modelList = ['modelA', 'modelB'];

        const globalState = {
            models: {
                modelGroupList: [0],
                modelGroups: {
                    0: {
                        modelList,
                        models: {
                            modelA: 'dataA',
                            modelB: 'dataB',
                        },
                    },
                },
            },
        } as unknown as GlobalModelState;

        expect(selectModelsOfGroup(globalState, 0)).toEqual(modelList);
    });

    it('should select the model data', () => {
        const modelData = {
            modelA: 'dataA',
            modelB: 'dataB',
        };

        const globalState = {
            models: {
                modelGroupList: [0],
                modelGroups: {
                    0: {
                        modelList: ['modelA', 'modelB'],
                        models: modelData,
                    },
                },
            },
        } as unknown as GlobalModelState;

        expect(selectModelDataOfGroup(globalState, 0)).toEqual(modelData);
    });

    it('should select the name', () => {
        const name = 'refC2';

        const globalState = {
            models: {
                modelGroupList: [0],
                modelGroups: {
                    0: {
                        name,
                    },
                },
            },
        } as unknown as GlobalModelState;

        expect(selectNameOfGroup(globalState, 0)).toEqual(name);
    });

    it('should select the statistical values', () => {
        const visibleSV = {
            mean: true,
            median: false,
            std: true,
            percentile: false,
        };

        const globalState = {
            models: {
                modelGroupList: [0],
                modelGroups: {
                    0: {
                        visibleSV,
                    },
                },
            },
        } as unknown as GlobalModelState;

        expect(selectStatisticalValueSettingsOfGroup(globalState, 0)).toEqual(visibleSV);
    });

    it('should select the correct visibility', () => {
        const isVisible = true;

        const globalState = {
            models: {
                modelGroupList: [0],
                modelGroups: {
                    0: {
                        isVisible,
                    },
                },
            },
        } as unknown as GlobalModelState;

        expect(selectVisibilityOfGroup(globalState, 0)).toEqual(isVisible);
    });

    it('should select all group ids', () => {
        const allGroupIds = [0, 1, 2, 3, 4, 5];
        const modelGroups = allGroupIds.reduce((p, c) => {
            return { ...p, [c]: {} };
        }, {});

        const globalState = {
            models: {
                modelGroups,
            },
        } as unknown as GlobalModelState;

        expect(selectAllGroupIds(globalState)).toEqual(allGroupIds);
    });
});
