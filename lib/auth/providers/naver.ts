import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface NaverProfile {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    name?: string;
    nickname?: string;
    profile_image?: string;
  };
}

export default function NaverProvider(
  options: OAuthUserConfig<NaverProfile>,
): OAuthConfig<NaverProfile> {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: {
      url: "https://nid.naver.com/oauth2.0/authorize",
      params: { response_type: "code" },
    },
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile) {
      const { response } = profile;
      return {
        id: response.id,
        name: response.name ?? response.nickname ?? "네이버 사용자",
        email: response.email,
        image: response.profile_image,
      };
    },
    options,
  };
}
