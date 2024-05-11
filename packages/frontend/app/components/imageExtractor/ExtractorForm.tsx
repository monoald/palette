import { Dispatch, useState } from "react";

type Props = {
  setUrl: Dispatch<React.SetStateAction<string>>;
};

export function ExtractorForm({ setUrl }: Props) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUrl(reader.result as string);
    };
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add("image-input--dragging-over");
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove("image-input--dragging-over");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const file = files[0];

    if (file) {
      // Check if the selected file has an allowed file type
      const allowedTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/bmp",
      ];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (event: Event) => {
          const target = event.target as EventTarget & { result: string };
          setUrl(target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div
        className="relative w-80 h-40 border-2 border-dashed border-secondary-border rounded-xl flex flex-col items-center justify-center text-[#cdcdcd80]"
        onDrop={
          !navigator.userAgent.includes("Firefox") ? handleDrop : () => ""
        }
        onDragOver={
          !navigator.userAgent.includes("Firefox") ? handleDragOver : () => ""
        }
        onDragLeave={
          !navigator.userAgent.includes("Firefox") ? handleDragEnd : () => ""
        }
      >
        <input
          className="absolute inset-0 text-transparent opacity-0"
          type="file"
          accept=".svg, .png, .jpeg, .jpg, .webp, .bmp"
          onChange={handleFileChange}
        />
        <p className="flex flex-col items-center gap-1">
          <span className="icon-image text-3xl" />
          {!navigator.userAgent.includes("Firefox")
            ? "Drop or Browse image"
            : "Browse image"}
        </p>
      </div>
    </div>
  );
}
