// Section.js
/** Stores the name of the LatitudeBandSelector component as a Symbol. */
export const LBS_Symbol = Symbol("LatitudeBandSelector");
/** Stores the name of the LocationSelector component as a Symbol. */
export const LS_Symbol = Symbol("LocationSelector");
/** Stores the name of the ModelGroupConfigurator component as a Symbol. */
export const MGC_Symbol = Symbol("ModelGroupConfigurator");
/** Stores the name of the OffsetConfigurator component as a Symbol. */
export const OC_Symbol = Symbol("OffsetConfigurator");
/** Stores the name of the PlotNameField component as a Symbol. */
export const PNF_Symbol = Symbol("PlotNameField");
/** Stores the name of the ReferenceModelSelector component as a Symbol. */
export const RMS_Symbol = Symbol("ReferenceModelSelector");
/** Stores the name of the ReferenceYearSlider component as a Symbol. */
export const RYS_Symbol = Symbol("ReferenceYearSlider");
/** Stores the name of the RegionSelector component as a Symbol. */
export const RS_Symbol = Symbol("RegionSelector");
/** Stores the name of the TimeCheckBoxGroup component as a Symbol. */
export const TCG_Symbol = Symbol("TimeCheckBoxGroup");
/** Stores the name of the XAxisSlider component as a Symbol. */
export const XAS_Symbol = Symbol("XAxisSlider");
/** Stores the name of the YAxisSlider component as a Symbol. */
export const YAS_Symbol = Symbol("YAxisSlider");

// LatitudeBandSelector.js
export const latitudeBands = [
    {
        text: Symbol("Southern Hemisphere (SH) Polar (90–60°S)"),
        value: [-90, -60]
    },
    {
        text: Symbol("SH Mid-Latitudes (60–35°S)"),
        value: [-60, -35]
    },
    {
        text: Symbol("Tropics (20°S–20°N)"),
        value: [-20, 20]
    },
    {
        text: Symbol("Northern Hemisphere (NH) Mid-Latitudes (35–60°N)"),
        value: [35, 60]
    },
    {
        text: Symbol("NH Polar (60–90°N)"),
        value: [60, 90]
    },
    {
        text: Symbol("Near-Global (60°S–60°N)"),
        value: [-60, 60]
    },
    {
        text: Symbol("Global (90°S–90°N)"),
        value: [90, -90]
    },
    {
        text: Symbol("Custom"),
        value: 'custom'
    },
]

// DownloadModal.js
export const fileFormats = [ Symbol("pdf"), Symbol("png") ];