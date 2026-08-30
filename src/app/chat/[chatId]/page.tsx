import { ChatView } from '@/components/chat-view';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatSubPage({ params }: PageProps) {
  const { chatId } = await params;
  return <ChatView initialChatId={chatId} />;
}
