import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface KakaoProfile {
  id: number;
  connected_at?: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export default function KakaoProvider(
  options: OAuthUserConfig<KakaoProfile>,
): OAuthConfig<KakaoProfile> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: {
      url: "https://kauth.kakao.com/oauth/authorize",
      params: {
        scope: "profile_nickname account_email",
      },
    },
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile) {
      return {
        id: String(profile.id),
        name:
          profile.kakao_account?.profile?.nickname ??
          profile.properties?.nickname ??
          "카카오 사용자",
        email: profile.kakao_account?.email,
        image:
          profile.kakao_account?.profile?.profile_image_url ??
          profile.properties?.profile_image,
      };
    },
    options,
  };
}
