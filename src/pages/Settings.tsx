// import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Icon } from "@chakra-ui/icon";
import { InfoIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, HStack } from "@chakra-ui/layout";
import { Avatar, Heading, Link, useToast } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { IoCodeSlash, IoColorPalette } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/Button";
import { useSetHeader } from "../features/recoil/header";
import {
  setTheme,
  setClientSettings,
  settings,
} from "../features/rtk/settingsSlice";
import { useColorContext } from "../utils/ColorContext";

export const Settings: React.FC = memo(function Fn() {
  const { colors } = useColorContext();
  const { register, handleSubmit } = useForm<{
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
    lightTheme: string;
    darkTheme: string;
    autoMotto: boolean;
    TLPostForm: boolean;
    iconSidebar: boolean;
  }>();
  const dispatch = useAppDispatch();
  const settingsValue = useAppSelector(settings);
  const toast = useToast();

  const onSubmitTheme = (data: { lightTheme: string; darkTheme: string }) => {
    dispatch(setTheme({ theme: data }));
    toast({
      title: "Successfully Changed!",
      duration: 2000,
      status: "info",
      position: "top",
    });
  };
  const onSubmitGenerall = (data: {
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
    autoMotto: boolean;
    TLPostForm: boolean;
    iconSidebar: boolean;
  }) => {
    dispatch(setClientSettings({ ...settingsValue.client, ...data }));
    toast({
      title: "Successfully Saved!",
      duration: 2000,
      status: "success",
      position: "top",
    });
  };
  useSetHeader("設定", "設定");
  return (
    <Box w="full" marginBlock="2" bgColor={colors.panel} borderRadius="md">
      <Tabs variant="enclosed" p="1">
        <TabList borderColor={colors.text}>
          <Tab
            _selected={{
              "*": {
                color: colors.secondary,
              },
            }}
          >
            <HStack mb="1" wrap="wrap" justify="center">
              <SettingsIcon fontSize="lg" color="inherit" />
              <Box>一般</Box>
            </HStack>
          </Tab>
          <Tab
            _selected={{
              "*": {
                color: colors.secondary,
              },
            }}
          >
            <HStack mb="1" wrap="wrap" justify="center">
              <Icon as={IoColorPalette} fontSize="xl" />
              <Box>テーマ</Box>
            </HStack>
          </Tab>
          <Tab
            _selected={{
              "*": {
                color: colors.secondary,
              },
            }}
          >
            <HStack mb="1" wrap="wrap" justify="center">
              <InfoIcon fontSize="lg" />
              <Box>情報</Box>
            </HStack>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel m="1">
            <form onSubmit={handleSubmit(onSubmitGenerall)}>
              <FormLabel>
                <Switch
                  marginRight="2"
                  defaultChecked={settingsValue.client.autoMotto}
                  {...register("autoMotto")}
                />
                自動でもっと読む
              </FormLabel>
              <FormLabel>
                <Switch
                  marginRight="2"
                  defaultChecked={settingsValue.client.TLPostForm}
                  {...register("TLPostForm")}
                />
                TL上部に投稿フォームを表示する
              </FormLabel>
              <FormLabel>
                <Switch
                  marginRight="2"
                  defaultChecked={settingsValue.client.iconSidebar}
                  {...register("iconSidebar")}
                />
                サイドバーでアイコンのみを表示する
              </FormLabel>
              <FormLabel>
                デフォルトの公開範囲
                <Select
                  {...register("defaultVisibility")}
                  defaultValue={settingsValue.client.defaultVisibility}
                  w="fit-content"
                  borderColor={colors.text}
                  _hover={{
                    borderColor: colors.baseThick,
                  }}
                  _focus={{
                    borderColor: colors.secondary,
                  }}
                  sx={{
                    option: {
                      bgColor: colors.base,
                    },
                  }}
                >
                  <option value="public">公開</option>
                  <option value="home">ホーム</option>
                  <option value="followers">フォロワー</option>
                  <option value="specified">ダイレクト</option>
                </Select>
              </FormLabel>
              <FormLabel>
                <Switch
                  marginRight="2"
                  defaultChecked={settingsValue.client.defaultLocalOnly}
                  {...register("defaultLocalOnly")}
                />
                ローカルのみ
              </FormLabel>
              <Button
                model="primary"
                fontWeight="normal"
                colorScheme="blue"
                marginTop="2"
                type="submit"
              >
                保存
              </Button>
            </form>
            <Button
              model="secondary"
              mt="2"
              fontWeight="normal"
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
              <HStack>
                <Box>
                  <FormLabel color={colors.text}>Light Mode</FormLabel>
                  <Select
                    {...register("lightTheme")}
                    defaultValue={settingsValue.theme.lightTheme}
                    variant="flushed"
                    borderColor={colors.text}
                    _hover={{
                      borderColor: colors.baseThick,
                    }}
                    _focus={{
                      borderColor: colors.secondary,
                    }}
                    sx={{
                      option: {
                        bgColor: colors.base,
                      },
                    }}
                  >
                    <option value="illuminating">illuminating</option>
                    <option value="moss">moss gray</option>
                  </Select>
                </Box>
                <Box>
                  <FormLabel color={colors.text}>Dark Mode</FormLabel>
                  <Select
                    {...register("darkTheme")}
                    defaultValue={settingsValue.theme.darkTheme}
                    variant="flushed"
                    borderColor={colors.text}
                    _hover={{
                      borderColor: colors.baseThick,
                    }}
                    _focus={{
                      borderColor: colors.secondary,
                    }}
                    sx={{
                      option: {
                        bgColor: colors.base,
                      },
                    }}
                  >
                    <option value="chillout">chillout</option>
                    <option value="Ginkgo">Ginkgo biloba</option>
                  </Select>
                </Box>
              </HStack>
              <Button
                model="primary"
                fontWeight="normal"
                colorScheme="blue"
                marginTop="2"
                type="submit"
              >
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
                      color={colors.secondary}
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
                    <Box color={colors.secondary}>
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
                  model="primary"
                  fontWeight="normal"
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
  );
});
