import { MantineThemeOverride } from '@mantine/core';


export default function getDefaultTheme(): MantineThemeOverride {
    return {
        colorScheme: 'dark',
        defaultRadius: 'md',
        primaryColor: 'blue',
        primaryShade: 5,
        colors: {
            'primarycolor': ['#5b9d40', '#528d3a', '#497e33', '#406e2d', '#375e26', '#2e4f20', '#243f1a', '#1b2f13', '#121f0d', '#091006'],
            'highlightcolor': ['#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9', '#EDF5E9'],
            'secondarycolor': ['#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E', '#F7921E',]
        }
    }
}