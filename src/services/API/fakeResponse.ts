export const fakeAxiosResponse = <T>(data: T) => {
    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    };
};
