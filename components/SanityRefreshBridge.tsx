"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CHANNEL_NAME = "sanity-content-sync";

export default function SanityRefreshBridge() {
  const router = useRouter();

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = () => router.refresh();
    return () => channel.close();
  }, [router]);

  return null;
}
