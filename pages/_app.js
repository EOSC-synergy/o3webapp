import react, {useEffect} from "react";
import {Provider} from "react-redux";
import store from '../src/store/store';
import {fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from '../src/services/API/apiSlice/apiSlice';
import {setModelsOfModelGroup} from "../src/store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP} from '../src/utils/constants';
import {updateStoreWithURL, updateURL} from "../src/services/url/url";
import {useRouter} from "next/router";
import "../styles/main.css";

function MyApp({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const emptyQuery = true;

            store.dispatch(fetchPlotTypes());
            store.dispatch(fetchModels()).then(
                () => {
                    // updateStoreWithURL();
                    store.dispatch(fetchPlotDataForCurrentModels(emptyQuery));
                    // updateURL();
                }
            );

            if (emptyQuery) {
                store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));
            }
        }
    }, [router.isReady, router.query])

    return <react.StrictMode>
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    </react.StrictMode>
}


export default MyApp
