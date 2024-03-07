import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, VStack, CircularProgress, CircularProgressLabel, useToast } from "@chakra-ui/react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const Index = () => {
  const pomodoroTime = 25; // 25 minutes for pomodoro
  const shortBreak = 5; // 5 minutes for short break
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // 'pomodoro', 'shortBreak', 'longBreak'
  const toast = useToast();

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft >= 1) return timeLeft - 1;
          // Automatically stop the timer and switch modes when time is up
          finishTimer();
          return 0;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "pomodoro" ? pomodoroTime * 60 : shortBreak * 60);
  };

  const finishTimer = () => {
    setIsActive(false);
    toast({
      title: "Time is up!",
      description: mode === "pomodoro" ? "Take a short break!" : "Ready to go another round?",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setMode(mode === "pomodoro" ? "shortBreak" : "pomodoro");
    setTimeLeft(mode === "pomodoro" ? shortBreak * 60 : pomodoroTime * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Container centerContent>
      <VStack spacing={4} mt={10}>
        <CircularProgress value={(timeLeft / (mode === "pomodoro" ? pomodoroTime : shortBreak) / 60) * 100} size="120px" thickness="4px" color="green.400">
          <CircularProgressLabel>{formatTime(timeLeft)}</CircularProgressLabel>
        </CircularProgress>
        <Text fontSize="xl">{mode === "pomodoro" ? "Pomodoro" : "Short Break"}</Text>
        <Box>
          {!isActive ? (
            <Button leftIcon={<FaPlay />} onClick={startTimer} colorScheme="green">
              Start
            </Button>
          ) : (
            <Button leftIcon={<FaPause />} onClick={pauseTimer} colorScheme="red">
              Pause
            </Button>
          )}
          <Button leftIcon={<FaRedo />} onClick={resetTimer} ml={2}>
            Reset
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
