"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { compressImage, MAX_UPLOAD_SIZE } from "@/lib/image-compression";

export function ImageUploadMood() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userNote, setUserNote] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function setImage(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_UPLOAD_SIZE) {
      setErrorMessage("Image too large for atmosphere capture.");
      return;
    }
    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return nextUrl;
    });
    setImageFile(file);
    setErrorMessage("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setImage(file);
  }

  async function generateMood() {
    if (!imageFile || isPreparing) return;

    setIsPreparing(true);
    setErrorMessage("");

    try {
      const compressed = await compressImage(imageFile);
      const imageDataUrl = await fileToDataUrl(compressed);
      const formData = new FormData();
      formData.append("image", compressed);
      if (userNote.trim()) formData.append("user_note", userNote.trim());

      sessionStorage.removeItem("hearspace:mood-result");
      sessionStorage.setItem("hearspace:mood-image", imageDataUrl);
      sessionStorage.setItem("hearspace:user-note", userNote.trim());
      sessionStorage.setItem("hearspace:mood-pending", "true");

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "无法创建空间记忆任务。");
      }

      const payload = (await response.json()) as { taskId?: string };
      if (!payload.taskId) throw new Error("空间记忆任务没有返回编号。");

      sessionStorage.setItem("hearspace:generation-task-id", payload.taskId);
      router.push(`/result?id=${encodeURIComponent(payload.taskId)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "这张照片暂时无法被保存，请换一张再试。",
      );
      setIsPreparing(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`group relative flex min-h-[52vh] w-full cursor-pointer items-center justify-center overflow-hidden bg-ink/[0.035] p-6 text-center transition duration-700 sm:min-h-[58vh] ${
            isDragging ? "bg-tide/10" : "hover:bg-ink/[0.055]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Uploaded atmosphere preview"
                className="absolute inset-0 h-full w-full object-cover transition duration-[2800ms] ease-out group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.38),transparent_46%,rgba(246,241,232,0.08))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_0%,rgba(17,17,19,0.18)_60%,rgba(17,17,19,0.45)_100%)]" />
              <div className="relative rounded-full bg-paper/72 px-4 py-2 font-meta text-[10px] uppercase tracking-[0.24em] text-ink/62 backdrop-blur-md">
                重新选择照片
              </div>
            </>
          ) : (
            <div className="max-w-sm">
              <p className="font-meta text-[10px] uppercase tracking-[0.3em] text-ink/36">
                上传空间照片
              </p>
              <p className="mt-5 font-serif text-3xl font-normal leading-tight text-ink/72 sm:text-4xl">
                房间、窗边、街角，或任何想被记住的一刻。
              </p>
            </div>
          )}
        </button>

        {errorMessage ? (
          <p className="max-w-xl text-center text-sm leading-6 text-ember">
            {errorMessage}
          </p>
        ) : null}

        <label className="w-full max-w-3xl">
          <span className="block text-center font-meta text-[10px] uppercase tracking-[0.28em] text-ink/34">
            给这一刻留一句话
          </span>
          <textarea
            value={userNote}
            onChange={(event) => setUserNote(event.target.value.slice(0, 180))}
            placeholder="比如：今天有点累，但这个地方让我慢了下来。"
            rows={3}
            className="mt-4 min-h-24 w-full resize-none rounded-[8px] border border-ink/10 bg-white/28 px-5 py-4 text-center font-serif text-lg leading-7 text-ink/72 outline-none backdrop-blur-xl transition duration-500 placeholder:text-ink/28 focus:border-tide/34 focus:bg-white/42"
          />
        </label>

        <button
          type="button"
          disabled={!previewUrl}
          onClick={generateMood}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition duration-500 hover:-translate-y-0.5 hover:bg-tide disabled:cursor-not-allowed disabled:bg-ink/24 disabled:text-paper/70 disabled:hover:translate-y-0"
        >
          {isPreparing ? "正在打开这段空间..." : "生成空间情绪"}
        </button>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
