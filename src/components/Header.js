import { createStyles, Group, Header, Title } from "@mantine/core";
import { IconBuildingEstate } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { AboutButton } from "./About";
import ColorSchemeToggle from "./ColorSchemeToggle";

const useStyles = createStyles((theme) => ({
  headerLink: {
    textDecoration: 'none',
    color: theme.colors.grape,
  },
}));

const HeaderMenu = ({ className, height }) => {
  const { classes } = useStyles();
    //height = 100;
  return (
    <Header height={height} className={className}>
      <Group sx={{ height: "100%"}} px={20} position="apart">
        <Link to="/" className={classes.headerLink}>
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
