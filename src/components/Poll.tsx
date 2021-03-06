import { Button } from "@chakra-ui/button";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack, Text, HStack } from "@chakra-ui/layout";
import React, { memo, useState, useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { allPolls } from "../features/pollSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { ParseMFM } from "./ParseMFM";

export const Poll: React.VFC<{
  id: string;
  emojis: Array<{
    name: string;
    url: string;
  }>;
}> = memo(function Fn({ id, emojis }) {
  const socket = useSocket();
  const poll = useAppSelector(allPolls).find((p) => p.id === id);
  const { colors, props } = useColorContext();
  const sum = poll?.choices.reduce((p, c) => p + c.votes, 0);
  const [voted, updateVoted] = useState(
    poll?.choices.some((choice) => choice.isVoted)
  );
  const [showVote, updateShowVote] = useState(voted);
  const expired =
    poll?.expiresAt && Date.now() - Date.parse(poll.expiresAt) > 0
      ? true
      : false;
  const pollVoteObject = useAPIObject({
    id: "pollVote",
    type: "api",
    endpoint: "notes/polls/vote",
    data: { noteId: id },
  }) as APIObject;

  useEffect(() => {
    updateVoted(poll?.choices.some((choice) => choice.isVoted));
  }, [poll?.choices]);
  return (
    <>
      {poll && (
        <>
          {expired || (voted && !poll.multiple) || showVote ? (
            <>
              <Flex justify="center">
                <VStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
                  {poll.choices.map((choice) => (
                    <Box key={choice.text} h="1.4em" w="full" pos="relative">
                      <Flex
                        h="full"
                        w="full"
                        borderRadius="md"
                        pos="absolute"
                        overflow="hidden"
                      >
                        <Box
                          bgColor={colors.primaryDarkerColor}
                          flexGrow={choice.votes}
                          transition="0.4s ease"
                          transitionProperty="flex-grow"
                        ></Box>
                        <Box
                          bgColor={colors.alpha200}
                          flexGrow={sum && sum - choice.votes}
                          transition="0.4s ease"
                          transitionProperty="flex-grow"
                        ></Box>
                      </Flex>
                      <Flex
                        h="full"
                        pos="absolute"
                        pl="2"
                        overflow="hidden"
                        alignItems="center"
                        color={colors.headerTextColor}
                      >
                        {choice.isVoted && <CheckIcon mr="1" />}
                        <ParseMFM
                          text={choice.text}
                          type="plain"
                          emojis={emojis}
                        />
                        {` (${choice.votes}???)`}
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Flex>
              <Flex justify="center" mt="1">
                <HStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
                  <Text>{`???${sum}???`}</Text>
                  {!expired &&
                    (!voted ||
                      (poll.multiple &&
                        poll.choices.some((choice) => !choice.isVoted))) && (
                      <Button
                        {...props.AlphaButton}
                        fontWeight="normal"
                        size="sm"
                        onClick={() => {
                          updateShowVote(!showVote);
                        }}
                      >
                        ????????????
                      </Button>
                    )}
                  {poll.expiresAt && <Text>{getLeftTime(poll.expiresAt)}</Text>}
                </HStack>
              </Flex>
            </>
          ) : (
            <>
              <Flex justify="center">
                <VStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
                  {poll.choices.map((choice, i) => (
                    <Button
                      key={choice.text}
                      {...props.AlphaButton}
                      pl="2"
                      h="1.4em"
                      w="full"
                      justifyContent="start"
                      disabled={choice.isVoted}
                      onClick={() => {
                        updateVoted(true);
                        Object.assign(pollVoteObject.body.data, { choice: i });
                        socket.send(JSON.stringify(pollVoteObject));
                      }}
                    >
                      {choice.isVoted && <CheckIcon mr="1" />}
                      <ParseMFM
                        text={choice.text}
                        type="plain"
                        emojis={emojis}
                      />
                    </Button>
                  ))}
                </VStack>
              </Flex>
              <Flex justify="center" mt="1">
                <HStack
                  spacing="1"
                  w="min(var(--chakra-sizes-2xl), 100%)"
                  alignItems="center"
                >
                  <Text>{`???${sum}???`}</Text>
                  <Button
                    {...props.AlphaButton}
                    fontWeight="normal"
                    size="sm"
                    onClick={() => {
                      updateShowVote(!showVote);
                    }}
                  >
                    ???????????????
                  </Button>
                  {poll.expiresAt && <Text>{getLeftTime(poll.expiresAt)}</Text>}
                </HStack>
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
});

function getLeftTime(time: string) {
  const d = Date.parse(time);
  const n = Date.now();
  const t = d - n;
  if (t < 0) {
    return "????????????";
  } else if (t / (365 * 24 * 60 * 60 * 1000) > 1) {
    return "??????????????????" + (t / (365 * 24 * 60 * 60 * 1000)).toFixed() + "???";
  } else if (t / (24 * 60 * 60 * 1000) > 1) {
    return "??????????????????" + (t / (24 * 60 * 60 * 1000)).toFixed() + "???";
  } else if (t / (60 * 60 * 1000) > 1) {
    return "??????????????????" + (t / (60 * 60 * 1000)).toFixed() + "??????";
  } else if (t / (60 * 1000) > 1) {
    return "??????????????????" + (t / (60 * 1000)).toFixed() + "???";
  } else {
    return "??????????????????" + (t / 1000).toFixed() + "???";
  }
}
