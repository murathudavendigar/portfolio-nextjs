import React from "react";
import { SocialIcon } from "react-social-icons";

type Props = {};

const Header = (props: Props) => {
  return (
    <header>
      <div className="flex flex-row items-center">
        {/* Social Icons */}
        <SocialIcon
          url="https://github.com/murathudavendigar"
          fgColor="gray"
          bgColor="transparent"
        />
        <SocialIcon
          url="https://twitter.com/murathoncu"
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
      </div>
      <div>
        <SocialIcon
          className="cursor-pointer"
          network="email"
          fgColor="gray"
          bgColor="transparent"
        />
        <p className="uppercase">Get In Touch</p>
      </div>
    </header>
  );
};

export default Header;
