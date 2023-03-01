import { ActionIcon, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Stack>
      <Text>
        This interactive Culver City rental registry map was created by Culver
        City resident Stephen Jones with Culver City for More Homes, based on
        data collected from landlords by the City of Culver City and obtained
        via public records requests.
      </Text>
      <Text>
        Read our <Link to="PrivacyPolicy">Privacy Policy</Link> for more information about how we collect and
        use data.
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
        onClose={() => {setOpened(false)}}
        size="auto"
      >
        <About />
      </Modal>

      <ActionIcon
        className={className}
        onClick={() => setOpened(true)}
      >
        <ThemeIcon variant={variant} size={size}>
          <IconInfoCircle size={18} />
        </ThemeIcon>
      </ActionIcon>
    </>
  );
};
