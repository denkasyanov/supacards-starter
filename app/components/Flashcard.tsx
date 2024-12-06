import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
};

const Flashcard = ({
  currentCard,
  showAnswer,
  handleShowAnswer,
  handleDifficultySelection,
}) => {
  return (
    <Card className="w-96 h-64 flex flex-col justify-between p-6 bg-[#2E2E2E] border-[#3ECF8E] border-2 shadow-lg">
      <CardContent className="text-center flex-grow flex items-center justify-center text-2xl text-white">
        {showAnswer ? currentCard.back : currentCard.front}
      </CardContent>
      {!showAnswer && (
        <Button
          onClick={handleShowAnswer}
          className="w-full mt-4 bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C] font-semibold"
        >
          Show Answer
        </Button>
      )}
      {showAnswer && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="outline"
            className="border-[#3ECF8E] text-[#3ECF8E] hover:bg-[#2E2E2E]"
            onClick={() => handleDifficultySelection("again")}
          >
            Again
          </Button>
          <Button
            variant="outline"
            className="border-[#3ECF8E] text-[#3ECF8E] hover:bg-[#2E2E2E]"
            onClick={() => handleDifficultySelection("hard")}
          >
            Hard
          </Button>
          <Button
            className="bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C] font-semibold"
            onClick={() => handleDifficultySelection("good")}
          >
            Good
          </Button>
          <Button
            variant="outline"
            className="border-[#3ECF8E] text-[#3ECF8E] hover:bg-[#2E2E2E]"
            onClick={() => handleDifficultySelection("easy")}
          >
            Easy
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Flashcard;
