import { IconButton, Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  AddIcon,
  AtSignIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Box,
  HStack,
  VStack,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Switch,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { UserLite } from "misskey-js/built/entities";
import React, { useEffect, useState } from "react";
import { memo } from "react";
import { useForm } from "react-hook-form";
import {
  IoAddCircle,
  IoFastFood,
  IoGlobe,
  IoHome,
  IoLockClosed,
  IoMail,
  IoStatsChart,
} from "react-icons/io5";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useModalsContext } from "../utils/ModalsContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { EmojiForm } from "./EmojiForm";
import { Note } from "./Note";
import { ParseMFM } from "./ParseMFM";

export const PostForm: React.VFC<{ isModal?: boolean }> = memo(function Fn({
  isModal,
}) {
  const socket = useSocket();
  const settingsValue = useAppSelector(settings);
  const userAddDisclosure = useDisclosure();
  const { colors, props } = useColorContext();
  const { register, handleSubmit, reset, getValues, setValue } = useForm();
  const {
    onPostModalClose,
    postModalType,
    modalNoteData,
    modalNoteType,
    setEmojiModalType,
  } = useModalsContext();
  const visibilityOpen = useDisclosure();
  const pollOpen = useDisclosure();
  const pollTimeUnitOpen = useDisclosure();
  const [visibility, setVisibility] = useState(settingsValue.defaultVisibility);
  const [localOnly, setLocalOnly] = useState(settingsValue.defaultLocalOnly);
  const [users, updateUsers] = useState<Array<UserLite>>([]);
  const [cw, updateCw] = useState(false);
  const [poll, updatePoll] = useState(false);
  const [pollNum, updatePollNum] = useState([0, 1]);
  const [pollTime, updatePollTime] = useState("inf");
  const [pollTimeUnit, updatePollTimeUnit] = useState("???");
  const [addedEmoji, addEmoji] = useState("");

  useEffect(() => {
    if (addedEmoji) {
      setValue("text", getValues("text") + addedEmoji);
      addEmoji("");
    }
  }, [addedEmoji, setValue, getValues]);

  useEffect(() => {
    if (isModal && modalNoteData.visibility)
      setVisibility(modalNoteData.visibility);
  }, [isModal, modalNoteData.visibility]);

  const postObject = useAPIObject({
    id: "post",
    type: "api",
    endpoint: "notes/create",
  }) as APIObject;
  const userAddObject = useAPIObject({
    id: "userAdd",
    type: "api",
    endpoint: "users/show",
  }) as APIObject;
  const onSubmit = (data: Record<string, unknown>) => {
    Object.assign(postObject.body.data, {
      visibility: data.visibility,
      text: data.text ? data.text : null,
      cw: cw ? data.cw : null,
      localOnly: localOnly,
      replyId: postModalType === "reply" ? modalNoteData.id : null,
      renoteId: postModalType === "quote" ? modalNoteData.id : null,
    });
    if (data.visibility === "specified") {
      Object.assign(postObject.body.data, {
        visibleUserIds: users.map((user) => user.id),
      });
    }
    if (poll) {
      const choices = Object.values(
        Object.fromEntries(
          Object.entries(data).filter((e) => e[0].startsWith("choice"))
        )
      );
      if (!choices.some((c) => !c)) {
        const expiresAt = data.pollDate
          ? Date.parse(`${data.pollDate} ${data.pollTime}`)
          : null;
        let expiredAfter = data.pollProg
          ? parseInt(data.pollProg as string)
          : null;
        if (expiredAfter) {
          expiredAfter =
            expiredAfter *
            1000 *
            (pollTimeUnit === "???"
              ? 60
              : pollTimeUnit === "??????"
              ? 60 * 60
              : pollTimeUnit === "???"
              ? 24 * 60 * 60
              : 1);
        }
        Object.assign(postObject.body.data, {
          poll: {
            choices: choices,
            multiple: data.multiple,
            expiresAt: expiresAt,
            expiredAfter: expiredAfter,
          },
        });
      }
    }
    socket.send(JSON.stringify(postObject));
    if (isModal) onPostModalClose();
    reset();
  };
  const onSubmitUserAdd = (data: Record<string, unknown>) => {
    Object.assign(userAddObject.body.data, {
      i: settingsValue.userInfo.userToken,
      username: data.username,
      host: data.host ? data.host : null,
    });
    fetch(
      `https://${settingsValue.userInfo.instance}/api/${userAddObject.body.endpoint}`,
      {
        method: "POST",
        body: JSON.stringify(userAddObject.body.data),
      }
    )
      .then((res) => {
        if (!res.ok) {
          // throw new Error(`${res.status} ${res.statusText}`);
          return {} as UserLite;
        }
        return res.json();
      })
      .then((text: UserLite) => {
        if (text.id && !users.some((user) => user.id === text.id)) {
          updateUsers([...users, text]);
        }
      });
    reset({ username: "", host: "" });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isModal && modalNoteData.id && postModalType && (
          <Box
            p="1"
            mb="2"
            borderWidth="2px"
            borderColor={colors.primaryColor}
            borderStyle="dashed"
          >
            <Note
              note={modalNoteData}
              type={modalNoteType}
              depth={1}
              onlyBody
            />
          </Box>
        )}
        {cw && (
          <Input
            {...register("cw")}
            placeholder="??????"
            mb="1"
            color={colors.textColor}
            borderColor={colors.alpha200}
            _hover={{ borderColor: colors.alpha400 }}
            _focus={{ borderColor: colors.secondaryColor }}
          />
        )}
        <Textarea
          {...register("text")}
          placeholder={
            !isModal
              ? "??????????????????????????????"
              : postModalType === "reply"
              ? "????????????????????????"
              : postModalType === "quote"
              ? "????????????????????????"
              : "??????????????????????????????"
          }
          color={colors.textColor}
          borderColor={colors.alpha400}
          _hover={{ borderColor: colors.alpha600 }}
          _focus={{ borderColor: colors.secondaryColor }}
          required
          autoFocus
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") handleSubmit(onSubmit)();
          }}
        />
        <Flex flexWrap="wrap" alignItems="center">
          <Menu
            closeOnSelect={false}
            isOpen={visibilityOpen.isOpen}
            onClose={visibilityOpen.onClose}
          >
            <MenuButton
              as={Button}
              aria-label="menu"
              size="xs"
              fontWeight="normal"
              m="1"
              color={colors.secondaryColor}
              onClick={visibilityOpen.onOpen}
              value={visibility}
              {...props.AlphaButton}
              {...register("visibility")}
            >
              <HStack spacing="0.5">
                {visibility === "public" ? (
                  <>
                    <Icon as={IoGlobe} />
                    <Box>??????</Box>
                  </>
                ) : visibility === "home" ? (
                  <>
                    <Icon as={IoHome} />
                    <Box>?????????</Box>
                  </>
                ) : visibility === "followers" ? (
                  <>
                    <Icon as={IoLockClosed} />
                    <Box>???????????????</Box>
                  </>
                ) : (
                  <>
                    <Icon as={IoMail} />
                    <Box>???????????????</Box>
                  </>
                )}
              </HStack>
            </MenuButton>
            <MenuList
              bgColor={colors.panelColor}
              color={colors.secondaryColor}
              borderColor={colors.alpha400}
            >
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("public");
                  visibilityOpen.onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoGlobe} />
                    <Box>??????</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("home");
                  visibilityOpen.onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoHome} />
                    <Box>?????????</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("followers");
                  visibilityOpen.onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoLockClosed} />
                    <Box>???????????????</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("specified");
                  visibilityOpen.onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoMail} />
                    <Box>???????????????</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha50 }}
                _active={{ bgColor: colors.alpha50 }}
              >
                <Box>
                  <HStack spacing="1" onClick={() => setLocalOnly(!localOnly)}>
                    <HStack
                      p="1"
                      backgroundColor={colors.alpha200}
                      borderRadius="md"
                    >
                      {localOnly ? (
                        <CheckIcon color={colors.primaryColor} />
                      ) : (
                        <CloseIcon
                          color={colors.secondaryColor}
                          fontSize="sm"
                        />
                      )}
                    </HStack>
                    <Icon fontSize="1.2em" as={IoFastFood} />
                    <Box>??????????????????</Box>
                  </HStack>
                </Box>
              </MenuItem>
            </MenuList>
          </Menu>
          {localOnly && (
            <Icon as={IoFastFood} color={colors.secondaryColor} mr="1" />
          )}
          {visibility === "specified" && (
            <>
              <HStack wrap="wrap" spacing="0.5">
                {users.length > 0 &&
                  users.map((user) => (
                    <Avatar
                      key={user.id}
                      name={user.username}
                      src={user.avatarUrl}
                      size="xs"
                      marginRight="1"
                      bg="none"
                      cursor="pointer"
                      onClick={() => {
                        updateUsers(users.filter((u) => u.id !== user.id));
                      }}
                    />
                  ))}
                <IconButton
                  aria-label="add dm user"
                  icon={<AddIcon />}
                  size="xs"
                  {...props.PrimaryButton}
                  onClick={() => {
                    userAddDisclosure.onOpen();
                  }}
                />
              </HStack>
            </>
          )}
        </Flex>
        {poll && (
          <VStack color={colors.textColor}>
            {pollNum.map((p, i) => (
              <InputGroup key={i}>
                <Input
                  placeholder={`????????? ${p + 1}`}
                  borderColor={colors.alpha400}
                  _hover={{ borderColor: colors.alpha600 }}
                  _focus={{ borderColor: colors.secondaryColor }}
                  required
                  {...register(`choice${i}`)}
                />
                {pollNum.length > 2 && i === pollNum.length - 1 && (
                  <InputRightElement>
                    <IconButton
                      aria-label="delete choice"
                      icon={<DeleteIcon />}
                      size="sm"
                      {...props.AlphaButton}
                      onClick={() => {
                        updatePollNum(
                          pollNum.filter((p) => p < pollNum.length - 1)
                        );
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            ))}
            <HStack>
              <Button
                {...props.AlphaButton}
                color={colors.secondaryColor}
                size="sm"
                onClick={() => {
                  updatePollNum([...pollNum, pollNum[pollNum.length - 1] + 1]);
                }}
              >
                <AddIcon mr="1" />
                ??????
              </Button>
              <Box>
                <Menu isOpen={pollOpen.isOpen} onClose={pollOpen.onClose}>
                  <MenuButton
                    as={Button}
                    aria-label="menu"
                    size="sm"
                    fontWeight="normal"
                    m="1"
                    color={colors.secondaryColor}
                    onClick={pollOpen.onOpen}
                    {...props.AlphaButton}
                  >
                    <HStack spacing="0.5">
                      {pollTime === "inf" ? (
                        <Box>?????????</Box>
                      ) : pollTime === "date" ? (
                        <Box>????????????</Box>
                      ) : (
                        <Box>????????????</Box>
                      )}
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bgColor={colors.panelColor}
                    color={colors.secondaryColor}
                    borderColor={colors.alpha400}
                    zIndex="5"
                  >
                    <MenuItem
                      _focus={{ bgColor: colors.alpha200 }}
                      onClick={() => {
                        updatePollTime("inf");
                      }}
                    >
                      <Box>?????????</Box>
                    </MenuItem>
                    <MenuItem
                      _focus={{ bgColor: colors.alpha200 }}
                      onClick={() => {
                        updatePollTime("date");
                      }}
                    >
                      <Box>????????????</Box>
                    </MenuItem>
                    <MenuItem
                      _focus={{ bgColor: colors.alpha200 }}
                      onClick={() => {
                        updatePollTime("prog");
                      }}
                    >
                      <Box>????????????</Box>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              <HStack spacing="0.5">
                <Switch {...register("multiple")} />
                <Box>???????????????</Box>
              </HStack>
            </HStack>
            {pollTime === "date" && (
              <HStack wrap="wrap" justify="center">
                <Input
                  w="4xs"
                  type="date"
                  color={colors.secondaryColor}
                  borderColor={colors.alpha400}
                  _hover={{ borderColor: colors.alpha600 }}
                  _focus={{ borderColor: colors.secondaryColor }}
                  {...register("pollDate")}
                />
                <Input
                  w="4xs"
                  type="time"
                  color={colors.secondaryColor}
                  borderColor={colors.alpha400}
                  _hover={{ borderColor: colors.alpha600 }}
                  _focus={{ borderColor: colors.secondaryColor }}
                  {...register("pollTime")}
                />
              </HStack>
            )}
            {pollTime === "prog" && (
              <InputGroup w="2xs">
                <Input
                  type="number"
                  defaultValue="10"
                  color={colors.secondaryColor}
                  borderColor={colors.alpha400}
                  _hover={{ borderColor: colors.alpha600 }}
                  _focus={{ borderColor: colors.secondaryColor }}
                  {...register("pollProg")}
                />
                <InputRightElement>
                  <Box>
                    <Menu
                      isOpen={pollTimeUnitOpen.isOpen}
                      onClose={pollTimeUnitOpen.onClose}
                    >
                      <MenuButton
                        as={Button}
                        aria-label="select time unit"
                        paddingInline="1"
                        size="sm"
                        fontWeight="normal"
                        onClick={pollTimeUnitOpen.onOpen}
                        {...props.AlphaButton}
                      >
                        <Box>{pollTimeUnit}</Box>
                      </MenuButton>
                      <MenuList
                        bgColor={colors.panelColor}
                        color={colors.secondaryColor}
                        borderColor={colors.alpha400}
                      >
                        <MenuItem
                          _focus={{ bgColor: colors.alpha200 }}
                          onClick={() => {
                            updatePollTimeUnit("???");
                          }}
                        >
                          <Box>???</Box>
                        </MenuItem>
                        <MenuItem
                          _focus={{ bgColor: colors.alpha200 }}
                          onClick={() => {
                            updatePollTimeUnit("???");
                          }}
                        >
                          <Box>???</Box>
                        </MenuItem>
                        <MenuItem
                          _focus={{ bgColor: colors.alpha200 }}
                          onClick={() => {
                            updatePollTimeUnit("??????");
                          }}
                        >
                          <Box>??????</Box>
                        </MenuItem>
                        <MenuItem
                          _focus={{ bgColor: colors.alpha200 }}
                          onClick={() => {
                            updatePollTimeUnit("???");
                          }}
                        >
                          <Box>???</Box>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </InputRightElement>
              </InputGroup>
            )}
          </VStack>
        )}
      </form>
      <HStack justifyContent="end" marginBlock="2">
        <IconButton
          aria-label="create poll"
          icon={<IoStatsChart />}
          size="sm"
          color={colors.secondaryColor}
          transform="rotate(90deg)"
          {...props.AlphaButton}
          onClick={() => {
            updatePoll(!poll);
          }}
        />
        <IconButton
          aria-label="content warning"
          icon={<ViewOffIcon />}
          size="sm"
          color={colors.secondaryColor}
          {...props.AlphaButton}
          onClick={() => {
            updateCw(!cw);
          }}
        />
        <Box>
          <Popover isLazy>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <IconButton
                    aria-label="reaction"
                    size="sm"
                    icon={<IoAddCircle size="1.4em" />}
                    color={colors.secondaryColor}
                    {...props.AlphaButton}
                    onClick={() => {
                      setEmojiModalType("picker");
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent
                  bgColor={colors.panelColor}
                  color={colors.textColor}
                  borderColor={colors.alpha400}
                  w="md"
                  maxW="90vw"
                >
                  <PopoverBody>
                    <EmojiForm onClose={onClose} addEmoji={addEmoji} />
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Box>
        <Button
          {...props.PrimaryButton}
          fontWeight="md"
          onClick={() => handleSubmit(onSubmit)()}
        >
          ?????????
        </Button>
      </HStack>
      <Modal
        isOpen={userAddDisclosure.isOpen}
        onClose={userAddDisclosure.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={colors.panelColor} pb="5">
          <form onSubmit={handleSubmit(onSubmitUserAdd)}>
            <ModalBody>
              <ModalHeader>
                <Text color={colors.secondaryColor}>?????????????????????</Text>
                <ModalCloseButton />
              </ModalHeader>
              <HStack spacing="0.5" mb="1">
                <InputGroup>
                  <InputLeftElement
                    fontSize="xs"
                    h="full"
                    color={colors.textColor}
                  >
                    <AtSignIcon />
                  </InputLeftElement>
                  <Input
                    size="xs"
                    placeholder="???????????????"
                    borderColor={colors.alpha200}
                    _hover={{ borderColor: colors.alpha400 }}
                    _focus={{ borderColor: colors.secondaryColor }}
                    required
                    {...register("username")}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement
                    fontSize="xs"
                    h="full"
                    color={colors.textColor}
                  >
                    <AtSignIcon />
                  </InputLeftElement>
                  <Input
                    size="xs"
                    placeholder="?????????(????????????)"
                    borderColor={colors.alpha200}
                    _hover={{ borderColor: colors.alpha400 }}
                    _focus={{ borderColor: colors.secondaryColor }}
                    pattern="(\S+\.)*\S+\.\S+"
                    {...register("host")}
                  />
                </InputGroup>
                <IconButton
                  aria-label="add dm user"
                  type="submit"
                  icon={<AddIcon />}
                  size="xs"
                  {...props.PrimaryButton}
                />
              </HStack>
              {users.length > 0 &&
                users.map((user) => (
                  <HStack key={user.id}>
                    <IconButton
                      aria-label="add dm user"
                      icon={<CloseIcon />}
                      size="xs"
                      {...props.PrimaryButton}
                      onClick={() => {
                        updateUsers(users.filter((u) => u.id !== user.id));
                      }}
                    />
                    <Avatar
                      name={user.username}
                      src={user.avatarUrl}
                      size="xs"
                      marginRight="1"
                      bg="none"
                    />
                    <Box color={colors.secondaryColor} isTruncated>
                      <ParseMFM
                        text={user.name ? user.name : user.username}
                        emojis={user.emojis}
                        type="plain"
                      />
                    </Box>
                  </HStack>
                ))}
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
});
