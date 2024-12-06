import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { CARDS } from "~/cards";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Practice Georgian · Supacard" },
    {
      name: "description",
      content: "Welcome to Supacard! Learn Georgian with flashcards.",
    },
  ];
};

const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export async function loader() {
  return json({ cards: CARDS });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const difficulty = formData.get("difficulty");

  return json({ cards: CARDS });
}

export default function Index() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState(CARDS[0]);
  const fetcher = useFetcher({ key: "difficulty" });

  const isLoading = fetcher.state !== "loading";

  const { cards } = useLoaderData<typeof loader>();

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  type Difficulty = "again" | "hard" | "good" | "easy";

  const handleDifficultySelection = (difficulty: Difficulty) => {
    const nextCard = getRandom(
      cards.filter((card) => card.front !== currentCard.front)
    );
    setShowAnswer(false);
    setCurrentCard(nextCard);
    console.log(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1C1C1C]">
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
              className="bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C]"
              onClick={() => handleDifficultySelection("again")}
            >
              Again
            </Button>
            <Button
              className="bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C]"
              onClick={() => handleDifficultySelection("hard")}
            >
              Hard
            </Button>
            <Button
              className="bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C]"
              onClick={() => handleDifficultySelection("good")}
            >
              Good
            </Button>
            <Button
              className="bg-[#3ECF8E] hover:bg-[#32A772] text-[#1C1C1C]"
              onClick={() => handleDifficultySelection("easy")}
            >
              Easy
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
