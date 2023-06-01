import { useState, useMemo, createContext } from 'react'
import { createTheme } from '@mui/material/styles'

// color tokens
export const tokens = mode => ({
  ...(mode === 'dark'
    ? {
        grey: {
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414'
        },
        primary: {
          100: '#d2d2d2',
          200: '#a4a4a4',
          300: '#777777',
          400: '#494949',
          500: '#1c1c1c', // Dark Body BG
          600: '#161616',
          700: '#111111',
          800: '#0b0b0b',
          900: '#060606'
        },
        greenAccent: {
          100: '#dbf5ee',
          200: '#b7ebde',
          300: '#94e2cd',
          400: '#70d8bd',
          500: '#4cceac',
          600: '#3da58a',
          700: '#2e7c67',
          800: '#1e5245',
          900: '#0f2922'
        },
        redAccent: {
          100: '#f8dcdb',
          200: '#f1b9b7',
          300: '#e99592',
          400: '#e2726e',
          500: '#db4f4a',
          600: '#af3f3b',
          700: '#832f2c',
          800: '#58201e',
          900: '#2c100f'
        },
        blueAccent: {
          100: '#e1e2fe',
          200: '#c3c6fd',
          300: '#a4a9fc',
          400: '#868dfb',
          500: '#6870fa',
          600: '#535ac8',
          700: '#3e4396',
          800: '#2a2d64',
          900: '#151632'
        }
      }
    : {
        grey: {
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#e0e0e0'
        },
        primary: {
          100: '#040509',
          200: '#080b12',
          300: '#0c101b',
          400: '#E7E7E7',
          500: '#FFFEF8',
          600: '#FDFDFA',
          700: '#FFFEF8',
          800: '#a1a4ab',
          900: '#d0d1d5'
        },
        greenAccent: {
          100: '#0f2922',
          200: '#1e5245',
          300: '#2e7c67',
          400: '#3da58a',
          500: '#4cceac',
          600: '#70d8bd',
          700: '#94e2cd',
          800: '#b7ebde',
          900: '#dbf5ee'
        },
        redAccent: {
          100: '#2c100f',
          200: '#58201e',
          300: '#832f2c',
          400: '#af3f3b',
          500: '#db4f4a',
          600: '#e2726e',
          700: '#e99592',
          800: '#f1b9b7',
          900: '#f8dcdb'
        },
        blueAccent: {
          100: '#151632',
          200: '#2a2d64',
          300: '#3e4396',
          400: '#535ac8',
          500: '#6870fa',
          600: '#868dfb',
          700: '#a4a9fc',
          800: '#c3c6fd',
          900: '#e1e2fe'
        }
      })
})

// theme settings
export const themeSettings = mode => {
  const colors = tokens(mode)

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.primary[100]
            },
            secondary: {
              main: colors.greenAccent[100]
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100]
            },
            background: {
              default: colors.primary[500],
              alt: colors.grey[900]
            }
          }
        : {
            // light mode
            primary: {
              main: colors.primary[100]
            },
            secondary: {
              main: colors.greenAccent[500]
            },
            neutral: {
              dark: colors.grey[200],
              main: colors.grey[800],
              light: colors.grey[600]
            },
            background: {
              default: '#fcfcfc',
              alt: colors.grey[900]
            }
          })
    },
    typography: {
      fontFammily: ['Source Sans Pro', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 40
      },
      h2: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 32
      },
      h3: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 24
      },
      h4: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 20
      },
      h5: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 16
      },
      h6: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 14
      }
    }
  }
}

export const ColorModeContext = createContext({
  toggleColorMode: () => {}
})

// toggle theme mode
export const useMode = () => {
  const [mode, setMode] = useState('dark')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )
  //Generate a theme base on the options received.
  // Then, pass it as a prop to ThemeProvider.
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return [theme, colorMode]
}

// // color design tokens export
// export const colorTokens = {
//     grey: {
//         0: "#FFFFFF",
//         10: "#EFEFEF", // custom Body dirty white | light mode 800
//         50: "#D4D4D4", // custom Sidebar Menu text
//         100: "#a4a4a4",
//         200: "#777777",
//         300: "#6C6C6C", // custom Box stroke
//         400: "#2F2F2F", // custom Regular Body Texts dark gray
//         500: "#1c1c1c",
//         600: "#161616",
//         700: "#111111",
//         800: "#141313", // custom sidebar Sidebar Background
//         900: "#0b0b0b",
//         1000: "#060606"
//     },
//     primary: {
//         10: "#E6FBFF",
//         50: "#d6eccc",
//         100: "#aed89a",
//         200: "#85c567",
//         300: "#549535", // custom Sidebar Menu Headers green
//         400: "#5db135",
//         500: "#349e02",
//         600: "#2a7e02",
//         700: "#1f5f01",
//         800: "#153f01",
//         900: "#0a2000"
//     },
// };

// // mui theme settings
// export const themeSettings = (mode) => {
//     return {
//         palette: {
//             mode: mode,
//             ...(mode === "dark"
//                 ? {
//                     // palette values for dark mode
//                     primary: {
//                         dark: colorTokens.primary[200],
//                         main: colorTokens.primary[500],
//                         light: colorTokens.primary[800],
//                     },
//                     neutral: {
//                         dark: colorTokens.grey[100],
//                         main: colorTokens.grey[200],
//                         mediumMain: colorTokens.grey[300],
//                         medium: colorTokens.grey[400],
//                         light: colorTokens.grey[700],
//                     },
//                     background: {
//                         default: colorTokens.grey[900],
//                         alt: colorTokens.grey[800],
//                     },
//                 }
//                 : {
//                     // palette values for light mode
//                     primary: {
//                         dark: colorTokens.primary[600],
//                         main: colorTokens.primary[500],
//                         light: colorTokens.primary[50],
//                     },
//                     neutral: {
//                         dark: colorTokens.grey[700],
//                         main: colorTokens.grey[500],
//                         mediumMain: colorTokens.grey[400],
//                         medium: colorTokens.grey[300],
//                         light: colorTokens.grey[50],
//                     },
//                     background: {
//                         default: colorTokens.grey[10],
//                         alt: colorTokens.grey[0],
//                     },
//                 }),
//         },
//         typography: {
//             fontFamily: ["Rubik", "sans-serif"].join(","),
//             fontSize: 12,
//             h1: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 40,
//             },
//             h2: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 32,
//             },
//             h3: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 24,
//             },
//             h4: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 20,
//             },
//             h5: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 16,
//             },
//             h6: {
//                 fontFamily: ["Rubik", "sans-serif"].join(","),
//                 fontSize: 14,
//             },
//         },
//     };
// };
