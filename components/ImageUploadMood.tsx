"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { AtmosphereLoading } from "@/components/AtmosphereLoading";
import { compressImage, MAX_UPLOAD_SIZE } from "@/lib/image-compression";
import { isMoodResult } from "@/lib/mood-schema";

export function ImageUploadMood() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDissolvingLoading, setIsDissolvingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    setFileName(file.name);
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
    if (!imageFile || isListening) return;

    setIsListening(true);
    setIsDissolvingLoading(false);
    setErrorMessage("");

    try {
      const compressed = await compressImage(imageFile);
      const formData = new FormData();
      formData.append("image", compressed);

      const response = await fetch("/api/generate-mood", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Mood generation failed.");
      }

      const payload = await response.json();

      if (!isMoodResult(payload.result)) {
        throw new Error("Mood generation returned an invalid result.");
      }

      if (
        process.env.NODE_ENV === "production" &&
        (payload.result.debug_source === "mock_api_error" ||
          payload.result.debug_source === "mock_no_key")
      ) {
        throw new Error("Mood generation used fallback result.");
      }

      const imageDataUrl = await fileToDataUrl(imageFile);
      sessionStorage.setItem("hearspace:mood-result", JSON.stringify(payload.result));
      sessionStorage.setItem("hearspace:mood-image", imageDataUrl);
      setIsDissolvingLoading(true);
      await sleep(760);
      router.push("/result");
    } catch {
      setErrorMessage("这段空间暂时还没有被听见，请稍后再试。");
      setIsListening(false);
      setIsDissolvingLoading(false);
    }
  }

  return (
    <>
      {isListening ? (
        <AtmosphereLoading
          imageSrc={previewUrl}
          isDissolving={isDissolvingLoading}
        />
      ) : null}

      <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_0.78fr]">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[360px] cursor-pointer items-center justify-center overflow-hidden border border-dashed p-6 text-center shadow-film transition sm:min-h-[440px] sm:rounded-[1.75rem] ${
          isDragging
            ? "border-tide bg-paper/78"
            : "border-ink/24 bg-paper/58 hover:border-ink/42"
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
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/18" />
            <div className="relative rounded-full bg-paper/82 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/64 backdrop-blur">
              Replace Image
            </div>
          </>
        ) : (
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/45">
              Image Drop Zone
            </p>
          <h2 className="mt-4 text-2xl font-semibold">Click or drop an image.</h2>
            <p className="mx-auto mt-3 max-w-sm leading-7 text-ink/62">
              Upload a room, a corner, a table, a window. HearSpace will read the
              mood from the photo.
            </p>
          </div>
        )}
      </button>

      <aside className="flex min-w-0 flex-col justify-between bg-paper/70 p-6 shadow-film backdrop-blur-md sm:rounded-[1.75rem] sm:p-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-tide">
            Preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold">
            {previewUrl ? "Atmosphere captured." : "Waiting for an image."}
          </h2>
          <p className="mt-4 min-h-14 leading-7 text-ink/62">
            {previewUrl
              ? fileName
              : "Drag a picture into the frame, or click the upload area to choose one."}
          </p>
          {errorMessage ? (
            <p className="mt-4 rounded-2xl bg-ember/10 px-4 py-3 text-sm leading-6 text-ember">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!previewUrl}
          onClick={generateMood}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper shadow-film transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-ink/28 disabled:text-paper/70 disabled:shadow-none disabled:hover:translate-y-0"
        >
          Generate Mood
        </button>
      </aside>
      </div>
    </>
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

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
