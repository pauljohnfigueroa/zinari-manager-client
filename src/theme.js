// color design tokens export
export const colorTokens = {
    grey: {
        0: "#FFFFFF",
        10: "#EFEFEF", // custom Body dirty white | light mode 800
        50: "#D4D4D4", // custom Sidebar Menu text 
        100: "#a4a4a4",
        200: "#777777",
        300: "#6C6C6C", // custom Box stroke
        400: "#2F2F2F", // custom Regular Body Texts dark gray
        500: "#1c1c1c",
        600: "#161616",
        700: "#111111",
        800: "#141313", // custom sidebar Sidebar Background
        900: "#0b0b0b",
        1000: "#060606"
    },
    primary: {
        10: "#E6FBFF",
        50: "#d6eccc",
        100: "#aed89a",
        200: "#85c567",
        300: "#549535", // custom Sidebar Menu Headers green
        400: "#5db135",
        500: "#349e02",
        600: "#2a7e02",
        700: "#1f5f01",
        800: "#153f01",
        900: "#0a2000"
    },
};

// mui theme settings
export const themeSettings = (mode) => {
    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    // palette values for dark mode
                    primary: {
                        dark: colorTokens.primary[200],
                        main: colorTokens.primary[500],
                        light: colorTokens.primary[800],
                    },
                    neutral: {
                        dark: colorTokens.grey[100],
                        main: colorTokens.grey[200],
                        mediumMain: colorTokens.grey[300],
                        medium: colorTokens.grey[400],
                        light: colorTokens.grey[700],
                    },
                    background: {
                        default: colorTokens.grey[900],
                        alt: colorTokens.grey[800],
                    },
                }
                : {
                    // palette values for light mode
                    primary: {
                        dark: colorTokens.primary[600],
                        main: colorTokens.primary[500],
                        light: colorTokens.primary[50],
                    },
                    neutral: {
                        dark: colorTokens.grey[700],
                        main: colorTokens.grey[500],
                        mediumMain: colorTokens.grey[400],
                        medium: colorTokens.grey[300],
                        light: colorTokens.grey[50],
                    },
                    background: {
                        default: colorTokens.grey[10],
                        alt: colorTokens.grey[0],
                    },
                }),
        },
        typography: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};