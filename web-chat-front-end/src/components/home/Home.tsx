import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, useEffect } from "react";
import { IoMdSend } from "react-icons/io";

import { io } from "socket.io-client";

const BACKEND_URL = 'http://localhost:3000';

const socket = io(BACKEND_URL, {
  forceNew: true
});

interface Message {
  text: string;
  time: string;
  nickname?: string;
}

const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('message', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const sendMessage = () => {
    const newMessage = inputValue.trim();
    if (newMessage !== '') {
      const currentTime = new Date().toLocaleTimeString();
      const messageData: Message = {
        text: newMessage,
        time: currentTime,
        nickname: nickname,
      };

      socket.emit('sendMessage', messageData);

      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen items-center">
      <h1 className="mt-1 text-4xl">WEB CHAT</h1>
      <div className="flex flex-col flex-grow w-full">
        {messages.map((message, index) => (
          <span key={index}>
            {message.nickname && `${message.nickname} - `}
            {message.text} 
            {message.time && ` (${message.time})`}
          </span>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 w-full max-w-s p-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Your nickname"
          value={nickname}
          onChange={handleNicknameChange}
          style={{ width: "100px" }}
        />
        <Input
          type="text"
          placeholder="Type ur message..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="submit" onClick={sendMessage}>
          <IoMdSend />
        </Button>
      </div>
    </div>
  );
};

export default App;
