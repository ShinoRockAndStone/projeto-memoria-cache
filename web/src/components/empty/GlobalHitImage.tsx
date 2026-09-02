import React from "react";

type Props = {
  caption?: string;
  alt?: string;
};

const GlobalHitImage: React.FC<Props> = ({
  caption,
  alt = "Global hit visualization",
}) => {
  return (
    <figure className="text-center my-6">
      <img
        src="/globalhit.png"
        alt={alt}
        className="mx-auto w-64 h-auto rounded-md shadow-sm"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default GlobalHitImage;
