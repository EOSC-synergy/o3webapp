import { getModels } from './client';

describe("connection with api", () => {
    it('gets the models', async () => {
        const response = await getModels();
        expect(response.data).not.toBe(null);
        console.log(await response.data);
    });
});