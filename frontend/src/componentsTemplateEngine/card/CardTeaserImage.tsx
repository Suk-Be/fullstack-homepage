const CardTeaserImage = ({ alt }: { alt: string }) => {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <div id="screenshot-container" className="relative flex w-full flex-1 items-stretch">
            <img
                src="https://sokdesign.de/images/about-me.jpg"
                alt={alt}
                className="
                  aspect-video h-full w-full 
                  flex-1 rounded-[10px] 
                  object-cover object-top

                  ring-1 ring-green/[0.2]
                group-hover:ring-green/[1]
                  focus:outline-none 
                focus-visible:ring-green-dark
                "
                onError={handleImageError}
            />
        </div>
    );
};

export default CardTeaserImage;
