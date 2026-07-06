"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

type Props = {};

const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [toggle, setToggle] = useState<boolean>();

  // Check if we're on blogs page or blog detail page
  const isOnBlogsPage = pathname?.startsWith("/blogs") ?? false;

  useEffect(() => {
    if (theme === "light") {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-5 mx-auto max-w-7xl xl:items-center ">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center">
        {/* Social Icons */}
        <SocialIcon
          url="https://github.com/murathudavendigar"
          fgColor="gray"
          bgColor="transparent"
        />
        <SocialIcon
          url="https://x.com/murathoncu"
          fgColor="gray"
          bgColor="transparent"
        />
        <SocialIcon
          url="https://www.linkedin.com/in/murathudavendigaroncu/"
          fgColor="gray"
          bgColor="transparent"
        />
        <SocialIcon
          url="https://medium.com/@murathoncu"
          fgColor="gray"
          bgColor="transparent"
        />
      </motion.div>

      <motion.div
        initial={{
          y: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className={`cursor-pointer w-8 h-5 md:w-16 md:h-10 flex items-center bg-gray-300 rounded-full p-1 ${
          toggle ? "bg-red-500 justify-end" : "justify-start"
        }`}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <motion.div
          layout
          className="w-4 h-4 bg-white rounded-full shadow-md md:w-8 md:h-8"></motion.div>
      </motion.div>

      <Link href="#contact">
        <motion.div
          initial={{
            x: 500,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="flex flex-row items-center text-gray-300 cursor-pointer">
          <Link
            href={isOnBlogsPage ? "/" : "/blogs"}
            className="text-gray-300 uppercase transition-colors duration-300 cursor-pointer dark:text-gray-900 hover:text-gray-500 dark:hover:text-gray-700">
            {isOnBlogsPage ? "Home" : "Blogs"}
          </Link>
          {!isOnBlogsPage && (
            <>
              <SocialIcon
                className="cursor-pointer"
                network="email"
                fgColor="gray"
                bgColor="transparent"
              />
              <p className="hidden text-sm text-gray-300 uppercase md:inline-flex dark:text-gray-900">
                Get In Touch
              </p>
            </>
          )}
        </motion.div>
      </Link>
    </header>
  );
};

export default Header;
