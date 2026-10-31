import { serviceSchema } from "./models";
export async function validateService(input: unknown) {
  const result = serviceSchema.safeParse(input);
  return result.success
    ? { success: true as const, data: result.data }
    : { success: false as const, error: "Проверьте поля объявления" };
}
