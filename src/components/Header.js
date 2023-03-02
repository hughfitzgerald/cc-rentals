import { Group, Header, Title } from "@mantine/core";
import { IconBuildingEstate } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { AboutButton } from "./About";
import ColorSchemeToggle from "./ColorSchemeToggle";

const HeaderMenu = ({ className, height }) => {
    //height = 100;
  return (
    <Header height={height} className={className}>
      <Group sx={{ height: "100%"}} px={20} position="apart">
        <Link to="/" style={{ textDecoration: 'none', color:"black" }}>
        <Title order={2}>
          <IconBuildingEstate /> Culver City Rental Registry
        </Title>
        </Link>
        <Group>
        <AboutButton variant="outline" size={29}/>
        <ColorSchemeToggle variant="outline" size={29} />
        </Group>
      </Group>
    </Header>
  );
};

export default HeaderMenu;
