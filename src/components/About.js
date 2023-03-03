import { ActionIcon, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Stack sx={{ maxWidth: 700 }}>
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
      <Text>
        Any inaccuracies are due to errors in the original data submissions, and
        we make no warranties as to the accuracy of any of the information
        provided.
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
