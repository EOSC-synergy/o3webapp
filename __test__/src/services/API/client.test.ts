import { getModels, getPlotData, getPlotTypes } from 'services/API/client';
import axios from 'axios';

//import { NO_MONTH_SELECTED } from 'utils/constants';

jest.mock('axios');

describe('Testing the getModels function', () => {
    it('should format the url correctly', async () => {
        await getModels();
        let url = (axios.get as jest.Mock).mock.calls[0][0];
        expect(url).toEqual('https://api.o3as.fedcloud.eu/api/v1/models');
        await getModels('tco3_zm');
        url = (axios.get as jest.Mock).mock.calls[1][0];
        expect(url).toEqual('https://api.o3as.fedcloud.eu/api/v1/models?ptype=tco3_zm');
        await getModels('tco3_zm', 'select');
        url = (axios.get as jest.Mock).mock.calls[2][0];
        expect(url).toEqual(
            'https://api.o3as.fedcloud.eu/api/v1/models?ptype=tco3_zm&select=select'
        );
    });
});

describe('tests the getPlotTypes function', () => {
    it('should format the url correctly', async () => {
        await getPlotTypes();
        const url = (axios.get as jest.Mock).mock.calls[0][0];
        expect(url).toEqual('https://api.o3as.fedcloud.eu/api/v1/plots');
    });
});

describe('tests the getPlotData function', () => {
    it('should format the url correctly', async () => {
        await getPlotData({
            plotId: 'tco3_zm',
            latMin: -90,
            latMax: 90,
            months: [1, 2, 3],
            startYear: 1960,
            endYear: 2100,
            modelList: ['modelA', 'modelB'], // not all models for faster testing!
            refYear: 1980,
            refModel: 'SBUV_GSFC_merged-SAT-ozone',
        });
        const url = (axios.post as jest.Mock).mock.calls[0][0];
        expect(url).toEqual(
            'https://api.o3as.fedcloud.eu/api/v1/plots/tco3_zm?begin=1960&end=2100&month=1,2,3&lat_min=-90&lat_max=90&ref_meas=SBUV_GSFC_merged-SAT-ozone&ref_year=1980'
        );
    });

    // test scenario impossible in typescript
    /*
    it('should throw an error if the month array is empty', async () => {
        await getPlotData({ months: [] }).catch((e) => {
            expect(String(e)).toEqual(`Error: ${NO_MONTH_SELECTED}`); // eslint-disable-line jest/no-conditional-expect
        });
    });
    */
});
