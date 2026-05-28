import { z } from "zod";

const hanjaGradeSchema = z.enum(["1", "2", "3", "4", "5", "6"], {
  error: "학년을 선택해주세요.",
});

const hanjaDifficultySchema = z.enum(["easy", "normal", "hard"], {
  error: "난이도를 선택해주세요.",
});

const hanjaBaseFields = {
  character: z
    .string({ error: "한자를 입력해주세요." })
    .trim()
    .min(1, "한자를 입력해주세요.")
    .max(4, "한자는 최대 4자까지 입력 가능합니다."),
  meaning: z
    .string({ error: "뜻을 입력해주세요." })
    .trim()
    .min(1, "뜻을 입력해주세요.")
    .max(100, "뜻은 최대 100자까지 입력 가능합니다."),
  reading: z
    .string({ error: "음을 입력해주세요." })
    .trim()
    .min(1, "음을 입력해주세요.")
    .max(50, "음은 최대 50자까지 입력 가능합니다."),
  examples: z
    .array(
      z
        .string()
        .trim()
        .min(1, "예시 단어를 입력해주세요.")
        .max(50, "예시 단어는 최대 50자까지 입력 가능합니다."),
    )
    .min(1, "예시 단어를 1개 이상 입력해주세요.")
    .max(10, "예시 단어는 최대 10개까지 등록 가능합니다."),
  explanation: z
    .string({ error: "그림 설명을 입력해주세요." })
    .trim()
    .min(1, "그림 설명을 입력해주세요.")
    .max(500, "그림 설명은 최대 500자까지 입력 가능합니다."),
  story: z
    .string()
    .trim()
    .max(1000, "스토리 설명은 최대 1000자까지 입력 가능합니다.")
    .optional(),
  grade: hanjaGradeSchema,
  difficulty: hanjaDifficultySchema,
  image: z
    .string()
    .trim()
    .url("올바른 이미지 URL을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "태그를 입력해주세요.")
        .max(20, "태그는 최대 20자까지 입력 가능합니다."),
    )
    .max(10, "태그는 최대 10개까지 등록 가능합니다.")
    .default([]),
};

export const HanjaCreateSchema = z.object(hanjaBaseFields);

export const HanjaUpdateSchema = HanjaCreateSchema.partial();

export type HanjaCreateInput = z.infer<typeof HanjaCreateSchema>;
export type HanjaUpdateInput = z.infer<typeof HanjaUpdateSchema>;
