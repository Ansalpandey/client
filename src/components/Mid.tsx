interface BrandIcon {
  src: string;
  shadow: string;
}

export default function Mid() {
  const brandIcons: BrandIcon[] = [
    {
      src: "/assets/logos/nodejs.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#68a063]",
    },
    {
      src: "/assets/logos/aws.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#ff9900]",
    },
    {
      src: "/assets/logos/kubernetes.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#326ce5]",
    },
    {
      src: "/assets/logos/springboot.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#6db33f]",
    },
    {
      src: "/assets/logos/java.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#f89820]",
    },
    {
      src: "/assets/logos/react.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#61dafb]",
    },
    {
      src: "/assets/logos/websockets.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#FFA500]",
    },

    {
      src: "/assets/logos/vite.svg",
      shadow: "hover:drop-shadow-[0_0_20px_#4b0082]",
    },
  ];

  return (
    <div className="w-full h-50 bg-[#000000]">
      <h1 className="w-full font-sans font-bold text-3xl text-center text-white">
        Built with
      </h1>
      <div className="w-full flex justify-center pt-10">
        <div className="flex gap-8 flex-wrap">
          {brandIcons.map((icon, index) => (
            <div
              key={index}
              className={`group transition-transform duration-150 hover:scale-110`}
            >
              <img
                src={icon.src}
                alt={`Brand Icon ${index + 1}`}
                className={`h-12 object-contain group-hover:brightness-125 ${icon.shadow}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
