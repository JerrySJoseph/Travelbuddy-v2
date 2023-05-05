import { createStyles } from '@mantine/core'
import React from 'react'


const useStyles = createStyles((theme) => ({
    navContainer: {
        height: '40px',
        backgroundColor: theme.colors['primarycolor'][0],
        padding: theme.spacing.md,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,

    },
}))


function TopBar() {
    const { classes } = useStyles();
  return (
    <div className={classes.navContainer}>TopBar</div>
  )
}

export default TopBar