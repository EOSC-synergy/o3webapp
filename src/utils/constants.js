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