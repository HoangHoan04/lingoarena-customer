"use client";

import { ArenaLiveMatchPlayer } from "@/components/arena";
import { useArenaStore } from "@/stores/useArenaStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ArenaLiveMatchRoomPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = String(params?.matchId || "");
  const { loadMatch } = useArenaStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!matchId) {
        if (mounted) setReady(true);
        return;
      }
      if (useArenaStore.getState().activeMatch?.matchId !== matchId) {
        await loadMatch(matchId);
      } else {
        useArenaStore.setState({ matchmakingStatus: "IDLE" });
      }
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [loadMatch, matchId]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ArenaLiveMatchPlayer />
      </div>
    </div>
  );
}
