import { IconButton } from "@chakra-ui/button";
import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Avatar, HStack } from "@chakra-ui/react";
import React from "react";
import { memo } from "react";
import { IoNotifications } from "react-icons/io5";
import { Link as RouterLink, useMatch } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { readNotification } from "../features/notificationsSlice";
import { settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useModalsContext } from "../utils/ModalsContext";

export const Header: React.VFC = memo(function Fn() {
  const user = useAppSelector(settings).userInfo.userData;
  const { colors } = useColorContext();
  const notify = useAppSelector(readNotification);
  const { onPostModalOpen } = useModalsContext();
  const isTop = useMatch("/");

  return (
    <>
      <Flex
        w="full"
        bgColor={colors.primaryColor}
        p="2"
        alignItems="center"
        justifyContent="space-between"
        pos="sticky"
        top="0"
        zIndex="5"
        maxW="6xl"
      >
        <HStack>
          <Text
            as={RouterLink}
            to="/"
            fontSize="xl"
            color={colors.headerTextColor}
            onClick={() => {
              if (isTop) {
                window.scrollTo(0, 0);
              }
            }}
          >
            AT DUSK
          </Text>
          <ColorModeSwitcher
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
            _active={{
              bgColor: colors.alpha400,
            }}
          />
        </HStack>
        <HStack alignItems="center">
          <IconButton
            aria-label="settings"
            icon={<SettingsIcon />}
            as={RouterLink}
            to={"/settings"}
            variant="ghost"
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
          />
          <Box pos="relative">
            <IconButton
              aria-label="notifications"
              icon={<IoNotifications fontSize="1.2em" />}
              as={RouterLink}
              to={"/notifications"}
              variant="ghost"
              color={colors.headerTextColor}
              _hover={{
                bgColor: colors.alpha50,
              }}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            />
            {!notify && (
              <>
                <Box
                  pos="absolute"
                  zIndex="2"
                  top="0"
                  right="0"
                  m="2"
                  p="1"
                  bgColor={colors.secondaryColor}
                  borderRadius="full"
                  sx={{
                    "@keyframes indicate": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                      },
                      "100%": {
                        transform: "scale(1)",
                      },
                    },
                  }}
                  animation="2s infinite indicate ease"
                />
              </>
            )}
          </Box>
          <Text as={RouterLink} to={`/user/@${user.username}`} color="blue.200">
            <Avatar
              key={user.id}
              name={user.username}
              src={user.avatarUrl}
              size="md"
              bg="none"
              cursor="pointer"
              borderColor={colors.primaryColor}
              borderWidth="2px"
              _hover={{
                borderColor: colors.secondaryColor,
                borderWidth: "2px",
              }}
            />
          </Text>
          <IconButton
            aria-label="new note"
            icon={<EditIcon />}
            color={colors.textColor}
            bgColor={colors.panelColor}
            shadow="md"
            onClick={onPostModalOpen}
          />
        </HStack>
      </Flex>
    </>
  );
});
