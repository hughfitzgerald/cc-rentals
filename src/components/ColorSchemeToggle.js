import { ActionIcon, ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const ColorSchemeToggle = ({ variant, className, size }) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <ActionIcon
          className={className}
          onClick={() => toggleColorScheme()}
          
        >
          <ThemeIcon variant={variant} size={size}>
          {colorScheme === "dark" ? (
            <IconSun size={18} />
          ) : (
            <IconMoonStars size={18} />
          )}
          </ThemeIcon>
        </ActionIcon>
    )
}

export default ColorSchemeToggle;