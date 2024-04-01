import Image from "next/image";
import home_blog from "@/public/img/home_blog.png";

export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
      <div className="basis-full flex flex-col justify-center md:basis-2/3">
        <p className="special-word text-xs">Mkaidev. Corporation</p>
        <h1 className="pb-5">
          Website<span className="special-word"> Blog</span>
          <br /> Development
        </h1>

        <p>
          Selamat datang di tempat di mana inspirasi dan pengetahuan bertemu.
          Temukan cerita menarik, informasi berguna, dan pandangan yang mendalam
          di sini.
        </p>
      </div>

      <div className="hidden md:block basis-1/3 mt-20">
        <Image
          src={home_blog}
          alt="Home blog"
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
