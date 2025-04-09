import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatProps {
  recipientId: number | null;
  onBack: () => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageList = ({ recipientId, onBack }: ChatProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  const { data: recipient } = useQuery<User>({
    queryKey: ['/api/users', recipientId],
    enabled: !!recipientId
  });
  
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', currentUser?.id, recipientId],
    enabled: !!currentUser?.id && !!recipientId,
    refetchInterval: 5000 // Poll every 5 seconds for new messages
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser?.id || !recipientId) return;
    
    try {
      // Mock send message for now (would be replaced by a mutation)
      console.log("Sending message:", {
        content: message,
        senderId: currentUser.id,
        receiverId: recipientId
      });
      
      // Clear input
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!recipientId) {
    return <div className="p-4 text-center text-muted-foreground">Select a conversation to start chatting</div>;
  }
  
  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)] shadow-none border-0 md:border md:shadow-sm">
      <CardHeader className="p-3 border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {recipient ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={recipient.profileImage} />
                <AvatarFallback>
                  {recipient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-medium">
                {recipient.name}
                <div className="text-xs font-normal text-muted-foreground">
                  {recipient.profession}
                </div>
              </CardTitle>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2">
                    {!isMe && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={recipient?.profileImage} />
                        <AvatarFallback>
                          {recipient?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[75%] ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                      <div className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(msg.timestamp)}
                        {isMe && (msg.read ? ' • Read' : ' • Delivered')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation with {recipient?.name}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageList;