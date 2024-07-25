import React, { useEffect, useRef } from 'react';
import Message from './Message';
import Question from './Question';

interface ChatMessagesProps {
  messages: any[];
  questions: any[];
  currentUser: any;
  onAnswerSubmit: (answer: string, questionId: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, questions, currentUser, onAnswerSubmit }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, questions]);

  return (
    <div className="messages-container overflow-auto mb-4 max-h-96">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} currentUser={currentUser?.uid || ''} />
      ))}
      {questions.map((qst) => (
        <Question key={qst.id} question={qst} currentUser={currentUser?.uid || ''} onAnswerSubmit={onAnswerSubmit} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
