import {getModels, postData} from './client';
import * as axios from 'axios';

jest.mock('axios');

describe("Testing the getModels function", () => {
    it('should format the url correctly', async () => {
        let url;
        await getModels();
        url = axios.get.mock.calls[0][0];
        expect(url).toEqual("https://api.o3as.fedcloud.eu/api/v1/models");
        await getModels("tco3_zm");
        url = axios.get.mock.calls[1][0];
        expect(url).toEqual("https://api.o3as.fedcloud.eu/api/v1/models?ptype=tco3_zm");
        await getModels("tco3_zm", "select");
        url = axios.get.mock.calls[2][0];
        expect(url).toEqual("https://api.o3as.fedcloud.eu/api/v1/models?ptype=tco3_zm&select=select");

    });
});
describe("Testing the postData function", () => {
    it('should format the url correctly', async () => {
        let url;
        await postData("tco3_zm");
        url = axios.post.mock.calls[0][0];
        expect(url).toEqual("https://api.o3as.fedcloud.eu/api/v1/data/tco3_zm");

    });
});