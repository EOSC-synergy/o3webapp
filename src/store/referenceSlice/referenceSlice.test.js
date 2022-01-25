import reducer, {
  setYear,
  setModel,
  setVisibility,
  setOffsetApplied,
} from "./referenceSlice";

const definedInitialState = {
  plotId: "tco3_zm", // currently active plot
  // maps plotTyps to their reference settings.
  settings: {
    tco3_zm: {
      name: "OCTS", // should show up in the drop down menu
      year: 1980,
      model: "defaultModel",
      isVisibile: false,
      isOffsetApplied: false,
    },
    tco3_return: {
      name: "Return/Recovery",
      year: 1980,
      model: "defaultModel",
      isVisibile: false,
      isOffsetApplied: false,
    },
  },
};

test("should return the initial state", () => {
  expect(reducer(undefined, {})).toEqual(
    definedInitialState // Expect initial state to be the defined initial state
  );
});

test("should update the active plot id", () => {
  const previousState = {
    plotId: "tco3_zm",
  };

  const expected = {
    // expect changed plotId
    plotId: "tco3_return",
  };

  expect(
    reducer(previousState, setActivePlotId({ plotId: "tco3_return" }))
  ).toEqual(expected);
});

test("should update the reference year of the current refference settings.", () => {
  const previousState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        year: 1980,
      },
    },
  };

  const expected = {
    // Expect the new state to have the new title
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        year: 2022,
      },
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setYear({ year: 2022 })
    )
  ).toEqual(expected);
});

test("should update the reference model of the current refference settings.", () => {
  const previousState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        model: "CCMI-1_CCCma_CMAM-refC2",
      },
    },
  };

  const expected = {
    // expect changed location
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        model: "CCMI-1_CCCma_CMAM-senC2CH4rcp85",
      },
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setModel({ model: "CCMI-1_CCCma_CMAM-senC2CH4rcp85" })
    )
  ).toEqual(expected);
});

test("should update the visibility of the current refference line.", () => {
  const previousState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        visibile: false,
      },
    },
  };
  const expectedState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        visibile: true,
      },
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setVisibility({ visible: true })
    )
  ).toEqual(expected);
});


test("should update the offset applied status of the current refference line.", () => {
  const previousState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        isOffsetApplied: false,
      },
    },
  };
  const expectedState = {
    plotId: "tco3_zm",
    settings: {
      tco3_zm: {
        isOffsetApplied: false,
      },
    },
  };

  expect(
    reducer(
      previousState, // use initial state
      setOffsetApplied({ isOffsetApplied: true })
    )
  ).toEqual(expected);
});