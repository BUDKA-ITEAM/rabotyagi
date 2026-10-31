export async function prepareAvatar(file: File): Promise<string> {
  const extension = /\.(png|jpe?g)$/i.test(file.name);
  if (
    !extension ||
    (file.type && !["image/png", "image/jpeg"].includes(file.type))
  )
    throw new Error("Выберите PNG, JPG или JPEG с устройства");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Размер файла должен быть не больше 10 МБ");
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(
      "Не удалось открыть изображение. Выберите другой PNG или JPEG",
    );
  });
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Обработка изображения недоступна");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 256, 256);
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      256,
      256,
    );
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value
            ? resolve(value)
            : reject(new Error("Не удалось обработать аватар")),
        "image/jpeg",
        0.85,
      ),
    );
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Не удалось прочитать аватар"));
      reader.readAsDataURL(blob);
    });
  } finally {
    bitmap.close();
  }
}
