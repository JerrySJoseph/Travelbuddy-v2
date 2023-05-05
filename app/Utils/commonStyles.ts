import { createStyles } from "@mantine/core";

export const useCommonStyles = createStyles((theme) => ({
    dflex: {
        display: 'flex',
        alignItems: 'center'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    h100: {
        height: '100%'
    },
    w100: {
        width: '100%'
    },
    w50: {
        width: '50%'
    },
    bgBlue: {
        backgroundColor: 'blue'
    },
    textCenter: {
        textAlign: 'center'
    },
    selectable: {
        cursor: 'pointer',
        ':hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.violet[0],
        },
    },
    scrollableY:{
        overflowY:"auto"
    },
    primaryColor: {
        color: theme.colors.violet[5]
    },
    capitalize:{
        textTransform:'capitalize'
    },
    spaceBetween:{
        justifyContent:'space-between'
    }
}))