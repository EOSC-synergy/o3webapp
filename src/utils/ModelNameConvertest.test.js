import { convertModelName } from "./ModelNameConverter";

describe("tests the model name parsing behaviour", () => {

    it("parses the project, institute and modelname", () => {
        const fullName = "CCMI-1_ACCESS_ACCESS-CCM-senC2fODS";
        expect(
            convertModelName(fullName)
        ).toEqual({
            project: "CCMI-1",
            institute: "ACCESS",
            name: "ACCESS-CCM-senC2fODS",
        });

    });

    it("parses correct modelname containing underscores", () => {
        const fullName = "CCMI-1_CESM1-CAM4Chem_refC1_r1i1p1";
        expect(
            convertModelName(fullName)
        ).toEqual({
            project: "CCMI-1",
            institute: "CESM1-CAM4Chem",
            name: "refC1_r1i1p1",
        });
    });

    it("throws an error if no string is provided", () => {
        expect(() => convertModelName({})).toThrowError();
    });

    it("returns the whole string if the pattern matching can't be applied correctly", () => {
        const fullName = "NotMatching";
        expect(
            convertModelName(fullName)
        ).toEqual({
            project: "",
            institute: "",
            name: fullName,
        });
    });

});