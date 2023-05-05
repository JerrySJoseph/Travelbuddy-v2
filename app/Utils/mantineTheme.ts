import { MantineThemeOverride } from '@mantine/core';


export default function getDefaultTheme(): MantineThemeOverride {
    return {
        colorScheme: 'light',
        defaultRadius: 'md',
        primaryColor: 'primarycolor',
        primaryShade: 5,
        colors: {
            'primarycolor': ['#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40', '#5B9D40'],
            'highlightcolor': ['#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9'],
            'secondarycolor': ['#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E',]
        }
    }
}