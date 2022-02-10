import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Icon } from "@chakra-ui/icon";
import { InfoIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, HStack } from "@chakra-ui/layout";
import { Avatar, Heading, Link, useToast } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoCodeSlash, IoColorPalette } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, setSettings, settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
export const Settings: React.VFC = () => {
  const { colors } = useColorContext();
  const { register, handleSubmit } = useForm<{
    lightTheme: string;
    darkTheme: string;
    autoMotto: boolean;
    TLPostForm: boolean;
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
  }>();
  const dispatch = useAppDispatch();
  const settingsValue = useAppSelector(settings);
  const toast = useToast();

  const onSubmitTheme = (data: { lightTheme: string; darkTheme: string }) => {
    dispatch(setTheme({ theme: data }));
    toast({
      title: "Successfully Changed!",
      duration: 500,
      status: "info",
      position: "top",
    });
  };
  const onSubmitGenerall = (data: {
    autoMotto: boolean;
    TLPostForm: boolean;
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
  }) => {
    dispatch(setSettings(data));
    toast({
      title: "Successfully Saved!",
      duration: 1000,
      status: "success",
      position: "top",
    });
  };
  useEffect(() => {
    document.title = "設定 | at Dusk.";
  }, []);
  return (
    <>
      <Box maxW="95vw" w="6xl" color={colors.textColor}>
        <Box
          w="full"
          marginBlock="2"
          fontSize="1.1em"
          bgColor={colors.panelColor}
          borderRadius="md"
        >
          <Tabs variant="enclosed" p="1">
            <TabList borderColor={colors.textColor}>
              <Tab _selected={{ color: colors.secondaryColor }}>
                <HStack mb="1" wrap="wrap" justify="center">
                  <SettingsIcon fontSize="lg" />
                  <Box>一般</Box>
                </HStack>
              </Tab>
              <Tab _selected={{ color: colors.secondaryColor }}>
                <HStack mb="1" wrap="wrap" justify="center">
                  <Icon as={IoColorPalette} fontSize="xl" />
                  <Box>テーマ</Box>
                </HStack>
              </Tab>
              <Tab _selected={{ color: colors.secondaryColor }}>
                <HStack mb="1" wrap="wrap" justify="center">
                  <InfoIcon fontSize="lg" />
                  <Box>情報</Box>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel m="1">
                <form onSubmit={handleSubmit(onSubmitGenerall)}>
                  <FormLabel userSelect="none">
                    <Switch
                      marginRight="2"
                      defaultChecked={settingsValue.autoMotto}
                      {...register("autoMotto")}
                    />
                    自動でもっと読む
                  </FormLabel>
                  <FormLabel userSelect="none">
                    <Switch
                      marginRight="2"
                      defaultChecked={settingsValue.TLPostForm}
                      {...register("TLPostForm")}
                    />
                    TL上部に投稿フォームを表示する
                  </FormLabel>
                  <FormLabel userSelect="none">
                    デフォルトの公開範囲
                    <Select
                      {...register("defaultVisibility")}
                      defaultValue={settingsValue.defaultVisibility}
                      color={colors.textColor}
                      size="sm"
                      w="fit-content"
                      sx={{
                        option: {
                          backgroundColor: colors.panelColor,
                        },
                      }}
                    >
                      <option value="public">公開</option>
                      <option value="home">ホーム</option>
                      <option value="followers">フォロワー</option>
                      <option value="specified">ダイレクト</option>
                    </Select>
                  </FormLabel>
                  <FormLabel userSelect="none">
                    <Switch
                      marginRight="2"
                      defaultChecked={settingsValue.defaultLocalOnly}
                      {...register("defaultLocalOnly")}
                    />
                    ローカルのみ
                  </FormLabel>
                  <Button colorScheme="blue" marginTop="2" type="submit">
                    保存
                  </Button>
                </form>
                <Button
                  mt="2"
                  colorScheme="red"
                  size="lg"
                  onClick={() => {
                    localStorage.clear();
                    location.reload();
                  }}
                >
                  Logout
                </Button>
              </TabPanel>
              <TabPanel m="1">
                <form onSubmit={handleSubmit(onSubmitTheme)}>
                  <HStack color={colors.headerTextColor}>
                    <Box>
                      <FormLabel color={colors.textColor}>Light Mode</FormLabel>
                      <Select
                        {...register("lightTheme")}
                        defaultValue={settingsValue.theme.lightTheme}
                        variant="flushed"
                        color={colors.textColor}
                        sx={{
                          option: {
                            backgroundColor: colors.panelColor,
                          },
                        }}
                      >
                        <option value="illuminating">illuminating</option>
                        <option value="moss">moss gray</option>
                      </Select>
                    </Box>
                    <Box>
                      <FormLabel color={colors.textColor}>Dark Mode</FormLabel>
                      <Select
                        {...register("darkTheme")}
                        defaultValue={settingsValue.theme.darkTheme}
                        variant="flushed"
                        color={colors.textColor}
                        sx={{
                          option: {
                            backgroundColor: colors.panelColor,
                          },
                        }}
                      >
                        <option value="chillout">chillout</option>
                        <option value="Ginkgo">Ginkgo biloba</option>
                      </Select>
                    </Box>
                  </HStack>
                  <Button colorScheme="blue" marginTop="2" type="submit">
                    更新
                  </Button>
                </form>
              </TabPanel>
              <TabPanel m="1">
                <Box>
                  <Heading size="md">アカウント情報</Heading>
                  <HStack mt="2" wrap="wrap">
                    <Avatar
                      src={settingsValue.userInfo.userData.avatarUrl}
                      size="lg"
                    />
                    <Box>
                      <HStack spacing="0" wrap="wrap">
                        <Box
                          color={colors.secondaryColor}
                          as={Link}
                          href={`https://${settingsValue.userInfo.instance}/@${settingsValue.userInfo.userData.username}`}
                          isExternal
                        >
                          {`@${settingsValue.userInfo.userData.username}@${settingsValue.userInfo.instance}`}
                        </Box>
                        <Box>としてログインしています</Box>
                      </HStack>
                      <HStack spacing="0" wrap="wrap">
                        <Box>アプリ名:</Box>
                        <Box color={colors.secondaryColor}>
                          {settingsValue.userInfo.appname}
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
                <Box mt="2">
                  <Heading size="md">at Dusk.について</Heading>
                  <Box>
                    at
                    Dusk.はオープンソースで提供されているMisskeyクライアントアプリケーションです。
                  </Box>
                  <Box>
                    <Button
                      as={Link}
                      colorScheme="teal"
                      href="https://github.com/sym-dev/at-Dusk"
                      isExternal
                    >
                      <Icon as={IoCodeSlash} fontSize="xl" />
                      ソースコード
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
};
