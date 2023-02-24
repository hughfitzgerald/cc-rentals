import { HoverCard, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { forwardRef } from "react";

export const FilterInfo = ({ infoText }) => {
  const InfoIcon = forwardRef((props, ref) => (
    <span ref={ref} {...props}>
      <Text span color="dimmed">
        <IconInfoCircle
          ref={ref}
          size={16} // set custom `width` and `height`
        />
      </Text>
    </span>
  ));

  return (
    <HoverCard shadow="md" position="top-start">
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
