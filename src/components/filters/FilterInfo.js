import { HoverCard, Text, ThemeIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { forwardRef } from "react";

export const FilterInfo = ({ infoText }) => {
  const InfoIcon = forwardRef((props, ref) => (
    <ThemeIcon variant="outline" ref={ref} {...props}>
      <IconInfoCircle
        ref={ref}
        size={16} // set custom `width` and `height`
      />
    </ThemeIcon>
  ));

  return (
    <HoverCard shadow="md" width={300}>
      <HoverCard.Target>
        <InfoIcon />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">{infoText}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default FilterInfo;
