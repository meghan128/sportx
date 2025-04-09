import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  id: string;
  userId: number;
  user: User;
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: number;
    read: boolean;
  };
  unreadCount: number;
}

interface ConversationListProps {
  onSelectConversation: (userId: number) => void;
  selectedUserId: number | null;
}

const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

const ConversationList = ({ onSelectConversation, selectedUserId }: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/messages/conversations'],
    refetchInterval: 10000 // Poll every 10 seconds for new messages
  });
  
  const { data: contacts } = useQuery<User[]>({
    queryKey: ['/api/users/contacts'],
  });
  
  // Filter conversations based on search term
  const filteredConversations = conversations?.filter(conversation => 
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.user.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="h-[calc(100vh-13rem)]">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Messages</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-17rem)]">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations && filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 flex items-start hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedUserId === conversation.userId ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation.userId)}
                >
                  <Avatar className="h-10 w-10 mr-3 mt-0.5">
                    <AvatarImage src={conversation.user.profileImage} />
                    <AvatarFallback>
                      {conversation.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium truncate ${conversation.unreadCount > 0 ? 'text-black dark:text-white' : ''}`}>
                        {conversation.user.name}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatLastActive(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate mr-2 ${
                        conversation.unreadCount > 0 ? 'text-black dark:text-white font-medium' : 'text-muted-foreground'
                      }`}>
                        {conversation.lastMessage.senderId !== conversation.userId && "You: "}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="rounded-full h-5 min-w-5 px-1.5">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-1 md:hidden" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No conversations found</p>
              {contacts && contacts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Suggested Contacts</h4>
                  <div className="space-y-3">
                    {contacts.slice(0, 5).map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-center gap-3 p-2 hover:bg-muted/50 cursor-pointer rounded-md"
                        onClick={() => onSelectConversation(contact.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contact.profileImage} />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="text-sm font-medium">{contact.name}</h5>
                          <p className="text-xs text-muted-foreground">{contact.profession}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;