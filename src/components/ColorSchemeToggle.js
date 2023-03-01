import { ActionIcon, ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const ColorSchemeToggle = ({ variant }) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <ActionIcon
          onClick={() => toggleColorScheme()}
          size={30}
        >
          <ThemeIcon variant={variant}>
          {colorScheme === "dark" ? (
            <IconSun size={16} />
          ) : (
            <IconMoonStars size={16} />
          )}
          </ThemeIcon>
        </ActionIcon>
    )
}

export default ColorSchemeToggle;