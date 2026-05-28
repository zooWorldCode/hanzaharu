import { z } from "zod";

const userRoleSchema = z.enum(["user", "admin"], {
  error: "올바른 역할을 선택해주세요.",
});

export const UserCreateSchema = z.object({
  name: z
    .string({ error: "닉네임을 입력해주세요." })
    .trim()
    .min(2, "닉네임은 2자 이상 입력해주세요.")
    .max(20, "닉네임은 최대 20자까지 입력 가능합니다.")
    .regex(
      /^[가-힣a-zA-Z0-9_]+$/,
      "닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.",
    ),
  email: z
    .string({ error: "이메일을 입력해주세요." })
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요.")
    .max(100, "이메일은 최대 100자까지 입력 가능합니다."),
  image: z
    .string()
    .trim()
    .url("올바른 프로필 이미지 URL을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  role: userRoleSchema.optional().default("user"),
});

export const UserUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상 입력해주세요.")
    .max(20, "닉네임은 최대 20자까지 입력 가능합니다.")
    .regex(
      /^[가-힣a-zA-Z0-9_]+$/,
      "닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.",
    )
    .optional(),
  email: z
    .string()
    .trim()
    .email("올바른 이메일 형식을 입력해주세요.")
    .max(100, "이메일은 최대 100자까지 입력 가능합니다.")
    .optional(),
  image: z
    .string()
    .trim()
    .url("올바른 프로필 이미지 URL을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  role: userRoleSchema.optional(),
});

export const UserProfileSchema = UserUpdateSchema.pick({
  name: true,
  image: true,
});

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
