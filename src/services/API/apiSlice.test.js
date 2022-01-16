import { fetchModels, fetchPlotTypes } from "./apiSlice"

describe("fetchModels thunk", () => {
    it('creates the action types', () => {
        const thunkActionCreator = fetchModels;
    
        expect(thunkActionCreator.pending.type).toBe('api/fetchModels/pending')
        expect(thunkActionCreator.fulfilled.type).toBe('api/fetchModels/fulfilled')
        expect(thunkActionCreator.rejected.type).toBe('api/fetchModels/rejected')
      })
    
    it('accepts arguments and dispatches the actions on resolve', async () => {
        const dispatch = jest.fn()
    
        let passedArg
    
        const result = 42
        const args = 123
        let generatedRequestId = ''
    
        const thunkActionCreator = createAsyncThunk(
          'testType',
          async (arg, { requestId }) => {
            passedArg = arg
            generatedRequestId = requestId
            return result
          }
        )
    
        const thunkFunction = thunkActionCreator(args)
    
        const thunkPromise = thunkFunction(dispatch, () => {}, undefined)
    
        expect(thunkPromise.requestId).toBe(generatedRequestId)
        expect(thunkPromise.arg).toBe(args)
    
        await thunkPromise
    
        expect(passedArg).toBe(args)
    
        expect(dispatch).toHaveBeenNthCalledWith(
          1,
          thunkActionCreator.pending(generatedRequestId, args)
        )
    
        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          thunkActionCreator.fulfilled(result, generatedRequestId, args)
        )
      })
});
