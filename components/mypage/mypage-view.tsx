"use client";

import { MypageRoomCanvas } from "@/components/mypage/mypage-room-canvas";

export type MypageProfile = {
  name: string;
  level: number;
  coins: number;
};

type MypageViewProps = {
  profile: MypageProfile;
};

export function MypageView({ profile }: MypageViewProps) {
  return (
    <MypageRoomCanvas
      userName={profile.name}
      level={profile.level}
      coins={profile.coins}
    />
  );
}
