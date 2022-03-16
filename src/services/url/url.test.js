import {createTestStore} from "../../store/store";
import {updateStoreWithURL, updateURL} from "./url";
import {O3AS_PLOTS} from "../../utils/constants";

let store;
describe('test the share link', () => {
    beforeEach(() => {
        store = createTestStore();
    });
    it('updates the url correctly', () => {
        updateURL(store);
        expect(window.location.search).toEqual("?plot=tco3_zm&lat_min=-90&lat_max=90&months=1,2,12&ref_meas=-1&ref_year=1980&ref_visible=1&x_zm=1960-2100&y_zm=0-0&x_return=0,1,2,3,4,5,6,7&y_return=0-0&title_zm=%22OCTS%20Plot%22&title_return=%22Return/Recovery%20Plot%22&group0=%22Example%20Group%22,11111,-1,-1,-1,PA7");
    });
    it('updates the store correctly', () => {
        updateStoreWithURL(store, '?plot=tco3_return&lat_min=-90&lat_max=90&months=1,2,12&ref_meas=104&ref_year=1980&ref_visible=1&x_zm=1960-2100&y_zm=270-320&x_return=0,1,2,3,4,5,6,7&y_return=1980-2090&title_zm=%22OCTS%20Plot%22&title_return=%22Return/Recovery%20Plot%22&group0=%22Example%20Group%22,11111,0,1,3,PA7');
        expect(store.getState().plot.plotId).toEqual(O3AS_PLOTS.tco3_return);
    });
});