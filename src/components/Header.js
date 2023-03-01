import { Group, Header, Title } from "@mantine/core";
import { IconBuildingEstate } from "@tabler/icons-react";
import ColorSchemeToggle from "./ColorSchemeToggle";

const HeaderMenu = ({ className, height }) => {
    //height = 100;
  return (
    <Header height={height} className={className}>
      <Group sx={{ height: "100%"}} px={20} position="apart">
        <Title order={2}>
          <IconBuildingEstate /> Culver City Rental Registry
        </Title>
        <ColorSchemeToggle variant="outline" />
      </Group>
    </Header>
  );
};

export default HeaderMenu;
