import reducer, {
  setYear,
  setModel,
  setVisibility,
  setOffsetApplied,
} from "./referenceSlice";

const definedInitialState = {

  settings: {
  
    year: 1980,
    model: "CCMI-1_ACCESS_ACCESS-CCM-refC2",
    visible: false,
    isOffsetApplied: false,
  },
  
};

test("should return the initial state", () => {
  expect(reducer(undefined, {})).toEqual(
    definedInitialState // Expect initial state to be the defined initial state
  );
});

test("should update the reference year of the current refference settings.", () => {
  const previousState = {
    settings: {
      
        year: 1980,
      
    },
  };

  const expectedState = {
    // Expect the new state to have the new title
    settings: {
      
        year: 2022,
      
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setYear({ year: 2022 })
    )
  ).toEqual(expectedState);
});

test("should update the reference model of the current refference settings.", () => {
  const previousState = {
    settings: {
     
        model: "CCMI-1_CCCma_CMAM-refC2",
      
    },
  };

  const expectedState = {
    // expect changed location
    settings: {
      
        model: "CCMI-1_CCCma_CMAM-senC2CH4rcp85",
      
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setModel({ model: "CCMI-1_CCCma_CMAM-senC2CH4rcp85" })
    )
  ).toEqual(expectedState);
});

test("should update the visibility of the current refference line.", () => {
  const previousState = {

    settings: {
      
        visible: false,
     
    },
  };
  const expectedState = {
    settings: {
      
        visible: true,
      
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setVisibility({ visible: true })
    )
  ).toEqual(expectedState);
});

test("should update the offset applied status of the current refference line.", () => {
  const previousState = {

    settings: {
     
        isOffsetApplied: false,
      
    },
  };
  const expectedState = {

    settings: {
      
        isOffsetApplied: true,
      
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setOffsetApplied({ isOffsetApplied: true })
    )
  ).toEqual(expectedState);
});
