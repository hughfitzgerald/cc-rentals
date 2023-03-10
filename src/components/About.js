import {
  ActionIcon,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconInfoCircle, IconBuildingEstate } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Stack sx={{ maxWidth: 700 }}>
      <Title order={2} color="grape.9">
        <IconBuildingEstate /> Culver City Rental Registry
      </Title>
      <Text>
        This site is not affiliated with or authorized by the City of Culver
        City.
      </Text>
      <Text>
        This interactive Culver City rental registry map was developed by Culver
        City resident Stephen Jones, in conjunction with{" "}
        <a
          rel="external noopener noreferrer"
          target="_blank"
          href="https://cc4mh.org/"
        >
          Culver City for More Homes
        </a>
        . The information in the map was collected by the City of Culver City
        directly from landlords. We obtained the data from the city via public
        records requests.
      </Text>
      <Text fw={700}>
        This service has been provided to allow easy access and a visual display
        of public records. Any inaccuracies are due to errors in the original
        data submissions. We make no warranties as to the accuracy of any of the
        information, and the maps and associated data are provided without
        warranty of any kind, either expressed or implied, including but not
        limited to, the implied warranties of merchantability and fitness for a
        particular purpose. Do not rely on the accuracy of this information for
        business decisions or other actions without first validating the data.
      </Text>
      <Text>
        Read our{" "}
        <Link to="PrivacyPolicy" rel="noopener" target="_blank">
          Privacy Policy
        </Link>{" "}
        for more information about how we collect and use data.
      </Text>
      <Text>
        Questions? You can reach us at{" "}
        <a href="mailto:info@ccrentals.org">info@ccrentals.org</a>.
      </Text>
    </Stack>
  );
};

export const AboutButton = ({ variant, className, size }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal
        title="About"
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        size="auto"
      >
        <About />
      </Modal>

      <ActionIcon className={className} onClick={() => setOpened(true)}>
        <ThemeIcon variant={variant} size={size}>
          <IconInfoCircle size={18} />
        </ThemeIcon>
      </ActionIcon>
    </>
  );
};
