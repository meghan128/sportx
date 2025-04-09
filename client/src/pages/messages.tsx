import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Separator } from "@/components/ui/separator";
import ConversationList from "@/components/community/messaging/conversation-list";
import MessageList from "@/components/community/messaging/message-list";
import { useIsMobile } from "@/hooks/use-mobile";

const MessagesPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showConversations, setShowConversations] = useState(true);
  const isMobile = useIsMobile();

  const handleSelectConversation = (userId: number) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const handleBack = () => {
    setShowConversations(true);
  };

  useEffect(() => {
    // On desktop, always show both panels
    if (!isMobile) {
      setShowConversations(true);
    }
  }, [isMobile]);

  return (
    <DashboardLayout title="Messages">
      <div className="md:grid md:grid-cols-3 md:gap-6 h-full">
        {/* Conversation List (Left Panel) */}
        {(showConversations || !isMobile) && (
          <div className="md:col-span-1 mb-6 md:mb-0">
            <ConversationList 
              onSelectConversation={handleSelectConversation} 
              selectedUserId={selectedUserId}
            />
          </div>
        )}

        {/* Messages (Right Panel) */}
        {(!showConversations || !isMobile) && (
          <div className="md:col-span-2">
            <MessageList 
              recipientId={selectedUserId} 
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;