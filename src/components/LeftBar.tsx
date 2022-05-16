import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import { IoHome, IoSettings } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/rtk/settingsSlice";
import { useColorContext } from "../utils/ColorContext";

import { Avatar } from "./Avatar";
import { ColorMode } from "./ColorMode";
import { Button } from "./ui/Button";

export const LeftBar = memo(function Fn() {
  const param = useParams();
  const { iconSidebar } = useAppSelector(settings).client;
  const { userData } = useAppSelector(settings).userInfo;
  const { colors } = useColorContext();
  return (
    <Box
      bgColor={colors.primary}
      height="calc(var(--vh, 1vh) * 100)"
      top="0"
      pos="sticky"
      px="4"
      py="2"
      sx={{
        "*": {
          color: colors.textPrimary,
        },
        "@media (max-aspect-ratio: 3/2), (max-width: 800px)": {
          ".leftbar-label": {
            display: "none",
          },
          px: 2,
        },
      }}
    >
      <VStack justify="space-between" height="full">
        <VStack alignItems="start" height="full">
          <HStack w="full">
            <Button
              fontSize="1em"
              state={param["*"] === ""}
              model="alpha-secondary"
              as={Link}
              to="/"
            >
              <IoHome fontSize="1.2em" />
              <Box
                className="leftbar-label"
                ml="1"
                {...(iconSidebar && { display: "none" })}
              >
                タイムライン
              </Box>
            </Button>
          </HStack>
          <HStack w="full">
            <Button
              state={param["*"] === "settings"}
              model="alpha-secondary"
              fontSize="1em"
              as={Link}
              to="/settings"
              width="full"
              justifyContent="start"
            >
              <IoSettings fontSize="1.2em" />
              <Box
                className="leftbar-label"
                ml="1"
                {...(iconSidebar && { display: "none" })}
              >
                設定
              </Box>
            </Button>
          </HStack>
        </VStack>
        <VStack>
          <Button
            state={param["*"] === `user/@${userData.username}`}
            model="alpha-secondary"
            fontSize="1em"
            as={Link}
            to={`/user/@${userData.username}`}
            width="full"
            justifyContent="start"
            h="fit-content"
            maxW="8em"
            overflow="hidden"
          >
            <Avatar user={userData} small />
            <Box
              w="full"
              className="leftbar-label"
              ml="1"
              {...(iconSidebar && { display: "none" })}
              noOfLines={1}
            >
              @{userData.username}
            </Box>
          </Button>
          <ColorMode />
        </VStack>
      </VStack>
    </Box>
  );
});
