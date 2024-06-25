import { Button } from "@chakra-ui/react";
import { MdArrowForward } from "react-icons/md";
import Link from "next/link";
import { FC } from "react";

interface HomeButtonProps {
  web: string;
  buttonText: string;
}

const HomeButton: FC<HomeButtonProps> = ({ web, buttonText }) => {
  return (
    <Link href={web} className="flex justify-end mt-2">
      <Button
        rightIcon={<MdArrowForward />}
        colorScheme="teal"
        variant="outline"
        size={"xs"}
      >
        {buttonText}
      </Button>
    </Link>
  );
};

export default HomeButton;
