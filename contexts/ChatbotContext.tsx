"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import jwt from "jsonwebtoken";
import type { DecodedJwt } from "@/types/user";
import { EventEmitter } from "events";
import { SUPABASE_ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookie";
import Cookies from "js-cookie";
import moment from "moment";
import config from "@/config/api";

export interface Message {
  id: string;
  chatbot: string;
  user: string;
  feedback: string;
  received: boolean;
  isAuthenticated?: boolean;
}

export interface ChatbotContextType {
  messages: Message[];
  inputValue: string;
  startTime: number | null;
  isLocked: boolean;
  setInputValue: (value: string) => void;
  setStartTime: (value: number | null) => void;
  setIsLocked: (value: boolean) => void;
  updateMessages: (messages: Message[]) => void;
  updateMessage: (answer: string, received: boolean, index: number) => void;
  updateFeedback: (index: number, feedback: string) => void;
  handleChatRequest: (value: string, index?: number | null) => void;
}

const extractChatContext = (messages: Message[], index: number) => {
  return messages
    .slice(Math.max(index - 5, 0), index)
    .flatMap((message) => [
      { user: message.user },
      { chatbot: message.chatbot },
    ]);
};

export const ChatbotContext = createContext<ChatbotContextType | undefined>(
  undefined,
);

export type ChatbotContextProps = React.PropsWithChildren & {
  chatHistory?: Message[];
};

export const ChatbotProvider = ({
  children,
  chatHistory,
}: ChatbotContextProps) => {
  const [messages, setMessages] = useState<Message[]>(chatHistory || []);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const chatStreamingRef = useRef<string>("");
  let user: DecodedJwt | null = null;

  let userPlan = "";
  const supabaseAccessToken =
    Cookies.get(SUPABASE_ACCESS_TOKEN_COOKIE_KEY) || "";
  if (!supabaseAccessToken) {
    userPlan = "BASIC";
  } else {
    const decodedJwt = jwt.decode(supabaseAccessToken) as DecodedJwt;
    if (decodedJwt) {
      user = decodedJwt;
      userPlan = decodedJwt.user_metadata.subscribedPlanName;
    } else {
      userPlan = "BASIC";
    }
  }

  useEffect(() => {
    setMessages(chatHistory || []);
  }, [chatHistory]);

  useEffect(() => {
    if (isCompleted && user) {
      saveChatHistory();
    }
  }, [messages]);

  const saveChatHistory = async () => {
    const params = {
      messages: messages,
    };
    try {
      await fetch(`${config.chatbot.save_chat_history}`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      setIsCompleted(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateMessages = useCallback((messages: Message[]) => {
    setMessages(messages);
  }, []);

  const addMessage = useCallback(
    (
      inputQuestion: string,
      received: boolean,
      answer: string,
      isAuthenticated?: boolean,
    ) => {
      setMessages((prevMessages: Array<Message>) => {
        const botReply = {
          user: inputQuestion,
          chatbot: answer,
          received: received,
          feedback: "",
          isAuthenticated: isAuthenticated ?? true,
        };
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        botReply.chatbot = botReply.chatbot ? botReply.chatbot : "";
        return [...updatedMessages, botReply] as Array<Message>;
      });
    },
    [],
  );

  const updateMessage = useCallback(
    (
      answer: string,
      received: boolean,
      index: number,
      isAuthenticated?: boolean,
    ) => {
      if (index !== null) {
        setMessages((prevMessages: any) => {
          const updatedMessages = [...prevMessages];
          const botReply = updatedMessages[index];
          botReply.chatbot = answer;
          botReply.received = received;
          botReply.feedback = "";
          botReply.isAuthenticated = isAuthenticated ?? true;
          updatedMessages[index] = botReply;
          return updatedMessages;
        });
      }
    },
    [],
  );

  const updateFeedback = useCallback((index: number, feedback: string) => {
    setMessages((prevMessages: any) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index].feedback = feedback;
      return updatedMessages;
    });
  }, []);

  const fetchWithTimeout = (url: string, options: any, timeout: number) => {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout),
      ),
    ]);
  };

  const sendMessageStream = async (payload: any, emitter: EventEmitter) => {
    let url =
      userPlan === "BASIC"
        ? `${process.env.NEXT_PUBLIC_CHATBOT_URL}/v2/chatbot_free`
        : `${process.env.NEXT_PUBLIC_CHATBOT_URL}/v2/chatbot_paid`;

    const errorMessage =
      "We're sorry, but there was an issue with the server. Please try again later.";

    try {
      const response: Response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: supabaseAccessToken,
          },
          body: JSON.stringify(payload),
        },
        30000,
      );

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          emitter.emit("data", chunk);
        }
      } else {
        emitter.emit("data", errorMessage);
      }
    } catch (error) {
      emitter.emit("data", errorMessage);
    }

    emitter.emit("complete");
  };

  const handleSetNewMessage = (value: string, index: number | null = null) => {
    if (index === null) {
      const newChat: Message = {
        id: `question${new Date().getTime()}`,
        user: value,
        chatbot: "",
        received: false,
        feedback: "",
        isAuthenticated: true,
      };

      updateMessages([...messages, newChat]);
    } else {
      updateMessage("", false, index);
    }
  };

  const handleChatRequest = async (
    value: string,
    index: number | null = null,
  ) => {
    const pattern = /^\s*$/;
    if (value === null || value === "" || pattern.test(value)) {
      return;
    }

    setIsLocked(true);
    handleSetNewMessage(value, index);
    if (user) {
      requestChat(value, index);
    } else {
      setInputValue("");
      const isNeedAuthenticate = await chatRequestCheck();
      if (isNeedAuthenticate) {
        const signRequestText = `Looks like you've reached your limit on our free plan. Upgrade now to continue enjoying uninterrupted access to our AI Chatbot and analytics platform! With our upgraded plan, you'll get: <br> <ul><li> *&nbsp;Unlimited interactions with our AI Chatbot for all your crypto inquiries.</li><li> *&nbsp;Access to comprehensive analytics and insights to stay ahead in the market.</li><li> *&nbsp;Enhanced features and tools to optimize your crypto strategies.</li></ul>`;
        const emitter = new EventEmitter();
        emitter.addListener("sign", (chunk: string) => {
          addMessage(value, true, chunk, false);

          if (startTime === null) {
            const startTimestamp = moment().unix();
            setStartTime(startTimestamp);
          }
        });
        emitter.emit("sign", signRequestText);
        setIsLocked(false);
      } else {
        requestChat(value, index);
      }
    }
  };

  const chatRequestCheck = async () => {
    try {
      const response = await fetch(`${config.chatbot.request_count_check}`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
        },
      });

      const data = await response.json();

      return !data?.status;
    } catch (error) {
      console.log("error", error);
      return true;
    }
  };

  const requestChat = (value: string, index: number | null = null) => {
    const chatContext = extractChatContext(messages, index ?? messages.length);
    setInputValue("");
    const params = {
      user_id: 1234,
      user_name: "TM GPT",
      messages: [...chatContext, { user: value }],
    };
    params.messages = params.messages.slice(-8);
    const emitter = new EventEmitter();
    let customKey = "";
    emitter.addListener("data", (chunk: string) => {
      if (!customKey) {
        customKey = "reply" + new Date().getTime();
      }
      chatStreamingRef.current = chatStreamingRef.current
        ? chatStreamingRef.current + chunk
        : chunk;
      if (index === null) {
        addMessage(value, false, chatStreamingRef.current);
      } else {
        updateMessage(chatStreamingRef.current, false, index);
      }
    });
    emitter.addListener("complete", () => {
      if (index === null) {
        addMessage(value, true, chatStreamingRef.current);
      } else {
        updateMessage(chatStreamingRef.current, true, index);
      }
      chatStreamingRef.current = "";
      emitter.removeAllListeners();
      if (startTime === null) {
        const startTimestamp = moment().unix(); // Get the Unix timestamp
        setStartTime(startTimestamp);
      }
      setIsLocked(false);
      setIsCompleted(true);
    });
    return sendMessageStream(params, emitter);
  };

  const value = React.useMemo(
    () => ({
      inputValue,
      startTime,
      isLocked,
      messages,
      setInputValue,
      setStartTime,
      setIsLocked,
      updateMessages,
      updateMessage,
      updateFeedback,
      handleChatRequest,
    }),
    [
      messages,
      startTime,
      inputValue,
      isLocked,
      chatStreamingRef,
      updateMessages,
      updateMessage,
      updateFeedback,
      handleChatRequest,
    ],
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

export const useChatbotContext = () =>
  useContext(ChatbotContext) as ChatbotContextType;
