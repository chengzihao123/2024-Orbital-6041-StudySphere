"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const ParticularForm: React.FC = (): JSX.Element => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    nickname: "",
    yearOfStudy: "",
    faculty: "",
    major: "",
    hobby: "",
    cca: "",
    birthday: "",
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form
    if (!formValues.nickname) {
      toast({
        title: "Let us know your cool nickname!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formValues.yearOfStudy) {
      toast({
        title: "Which year are you currently in?",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formValues.faculty) {
      toast({
        title: "Faculty is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formValues.major) {
      toast({
        title: "Major is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formValues.birthday) {
      toast({
        title: "Please let us know your birthday.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    router.push("/home");
    toast({
      title: "Thank you for letting us know more about you!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="500px" mx="auto" p={5} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="nickname">
            <FormLabel>Nickname</FormLabel>
            <Input
              type="text"
              name="nickname"
              value={formValues.nickname}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="yearOfStudy">
            <FormLabel>Year of Study</FormLabel>
            <Select
              name="yearOfStudy"
              onChange={handleChange}
              value={formValues.yearOfStudy}
            >
              <option value="">Select Year</option>
              <option value="Year 1">1</option>
              <option value="Year 2">2</option>
              <option value="Year 3">3</option>
              <option value="Year 4">4</option>
              <option value="Year 5">5</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </Select>
          </FormControl>

          <FormControl id="faculty">
            <FormLabel>Faculty</FormLabel>
            <Input
              type="text"
              name="faculty"
              value={formValues.faculty}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="major">
            <FormLabel>Major</FormLabel>
            <Input
              type="text"
              name="major"
              value={formValues.major}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="hobby">
            <FormLabel>Hobby</FormLabel>
            <Input
              type="text"
              name="hobby"
              value={formValues.hobby}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="cca">
            <FormLabel>CCA</FormLabel>
            <Input
              type="text"
              name="cca"
              value={formValues.cca}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="birthday">
            <FormLabel>Birthday</FormLabel>
            <Input
              type="date"
              name="birthday"
              value={formValues.birthday}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ParticularForm;
