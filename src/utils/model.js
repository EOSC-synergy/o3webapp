
/**
 * A type definition for a model.
 * @typedef {Object} Model
 * @property {String} name - the name of the module
 * @property {String} institute - institution that issued the model
 * @property {String} dataset - the dataset used for the model
 * @property {boolean} mean - whether the mean is currently plotted or not
 * @property {boolean} derivative - whether the derivative is currently plotted or not
 * @property {boolean} median - whether the median is currently plotted or not
 * @property {boolean} percentile - whether the percentile is currently plotted or not
 * @property {String} colors - the color of the model used in the graph
 * @property {String} plotStyle - the plotStyle of the model used in the graph
 */

   // modelGroups = [
    //     {
    //         name: "Something",
    //         models: [
    //             {
    //                 name: "Something 2",
    //                 institute: "Something else"
    //                 dataset: "more something"
    //                 mean: true,
    //                 derivative: true,
    //                 median: true,
    //                 percentile: true,
    //                 color: "XXX",
    //                 plotStyle: "XXX",

    //             }
    //         ],
    //         hidden: false,
    //         derivativeVisible: false,
    //         meanVisible: false,
    //         medianVisible: false,
    //         percentileVisible: false
    //     }
    // ]