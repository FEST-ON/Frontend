"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ChatPanel } from "@/features/ai-guide/ui/chat-panel";
import { CourseRecommender } from "@/features/ai-guide/ui/course-recommender";

export default function AiGuidePage() {
  return (
    <div className="flex h-[calc(100vh-64px-64px)] flex-col">
      <div className="px-4 pt-4">
        <h1 className="text-lg font-extrabold text-foreground">AI 축제 안내</h1>
        <p className="text-xs text-muted-foreground">자주 묻는 질문을 눌러보거나, 맞춤 코스를 추천받아 보세요</p>
      </div>
      <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 grid grid-cols-2">
          <TabsTrigger value="chat">자주 묻는 질문</TabsTrigger>
          <TabsTrigger value="course">맞춤 코스 추천</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex flex-1 flex-col overflow-hidden">
          <ChatPanel />
        </TabsContent>
        <TabsContent value="course" className="flex-1 overflow-y-auto">
          <CourseRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
}
