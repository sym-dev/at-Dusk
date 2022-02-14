import {
  Box,
  Container,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Stack,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { store } from "../app/store";
import { setUserInfo } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";

export const LoginForm: React.VFC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<{
    appname: string;
    instance: string;
  }>();
  const { colors } = useColorContext();
  const { setColorMode } = useColorMode();
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
    setColorMode(theme);
    document.querySelector(":root")?.setAttribute("mode", theme);
    document
      .querySelector(":root")
      ?.setAttribute("theme", theme === "dark" ? "chillout" : "illuminating");
  }, [theme, setColorMode]);

  const [fetchState, updateFetchState] = useState<{
    ok: boolean;
    message: string;
  }>({ ok: true, message: "" });

  const onSubmit = (data: { appname: string; instance: string }) => {
    const id = uuid();
    const appURL = document.location.href;
    const checkMiAuthURL = `https://${data.instance}/api/endpoints`;
    fetch(checkMiAuthURL, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((text) => {
        if (text.includes("miauth/gen-token")) {
          const settings = store.getState().settings.userInfo;
          store.dispatch(
            setUserInfo({
              ...settings,
              instance: data.instance,
              appname: data.appname,
              themeMode: theme,
            })
          );
          const authURL =
            `https://${data.instance}/miauth/${id}?name=${data.appname}&callback=${appURL}` +
            // "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:pages,write:pages,write:page-likes,read:page-likes,read:user-groups,write:user-groups,read:channels,write:channels,read:gallery,write:gallery,read:gallery-likes,write:gallery-likes";
            "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:channels,write:channels";
          window.location.href = authURL;
        } else {
          updateFetchState({
            ok: false,
            message: "インスタンスがMiAuthに対応していないようです",
          });
        }
      })
      .catch(() => {
        updateFetchState({
          ok: false,
          message: "それはMisskeyのインスタンスですか？",
        });
      });
  };

  return (
    <>
      <Box minW="full" color={colors.textColor}>
        <Container
          boxShadow="base"
          mt="6"
          p={4}
          borderRadius="md"
          {...(theme === "dark" && { bgColor: colors.alpha50 })}
        >
          <Heading
            as="h3"
            size="2xl"
            mb="4"
            fontWeight="normal"
            bgGradient="linear(to top, #ffa17f, #00223e)"
            bgClip="text"
            isTruncated
          >
            at Dusk.
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl isInvalid={errors.appname ? true : false}>
                <FormLabel htmlFor="appname">アプリ名</FormLabel>
                <Input
                  id="appname"
                  placeholder="@dusk"
                  defaultValue="@dusk"
                  {...register("appname", { required: "アプリ名は必須です" })}
                />
                <FormErrorMessage>
                  {errors.appname && errors.appname.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.instance ? true : false}>
                <FormLabel htmlFor="instance">インスタンス名</FormLabel>
                <Input
                  id="instance"
                  placeholder="misskey.io"
                  {...register("instance", {
                    required: "インスタンス名は必須です",
                    pattern: {
                      value: /(\S+\.)?\S+\.\S+/,
                      message: "インスタンスのドメインを入力してください。",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.instance && errors.instance.message}
                </FormErrorMessage>
              </FormControl>
              {!fetchState.ok && (
                <FormControl isInvalid={!fetchState.ok}>
                  <FormErrorMessage>{fetchState.message}</FormErrorMessage>
                </FormControl>
              )}
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Register
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </>
  );
};
