import { Switch, Group, useMantineColorScheme, useMantineTheme, Box, Center, SegmentedControl } from '@mantine/core';
import { IconSun, IconMoonStars, IconMoon } from '@tabler/icons';

export function DarkThemeToggleSwitch() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
      data={[
        {
          value: 'light',
          label: (
            <Center>
              <IconSun size={16} stroke={1.5} />
              <Box ml={10}>Light</Box>
            </Center>
          ),
        },
        {
          value: 'dark',
          label: (
            <Center>
              <IconMoon size={16} stroke={1.5} />
              <Box ml={10}>Dark</Box>
            </Center>
          ),
        },
      ]}
    />
  );
}