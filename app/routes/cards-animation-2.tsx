import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion, useSpring, AnimatePresence } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import type { ComponentType } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "3D Flip Card" },
    { name: "description", content: "Interactive 3D flip card component" },
  ];
};

// Spring animation parameters
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
};

const slideSpring = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

interface BaseFlipProps {
  width?: string | number;
  height?: string | number;
  variant?: "Front" | "Back";
  style?: React.CSSProperties;
}

interface FlipComponentProps<T> extends BaseFlipProps {
  data?: T;
}

const cards = [
  { front: "Front Side 1", back: "Back Side 1" },
  { front: "Front Side 2", back: "Back Side 2" },
  { front: "Front Side 3", back: "Back Side 3" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({});
};

export function withFlip<T>(
  Component: ComponentType<FlipComponentProps<T>>
): ComponentType<FlipComponentProps<T>> {
  return (props) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [rotateXaxis, setRotateXaxis] = useState(0);
    const [rotateYaxis, setRotateYaxis] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
      if (isFlipped) {
        // When card is flipped (showing back), trigger exit animation immediately
        setIsExiting(true);
      } else {
        // When card is showing front, just flip it
        setIsFlipped(true);
      }
    };

    const handleExitComplete = () => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      setIsExiting(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isExiting) return;

      const element = cardRef.current;
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const elementWidth = elementRect.width;
      const elementHeight = elementRect.height;
      const elementCenterX = elementWidth / 2;
      const elementCenterY = elementHeight / 2;
      const mouseX = event.clientY - elementRect.y - elementCenterY;
      const mouseY = event.clientX - elementRect.x - elementCenterX;
      const degreeX = (mouseX / elementWidth) * 20;
      const degreeY = (mouseY / elementHeight) * 20;
      setRotateXaxis(degreeX);
      setRotateYaxis(degreeY);
    };

    const handleMouseEnd = () => {
      setRotateXaxis(0);
      setRotateYaxis(0);
    };

    const dx = useSpring(0, spring);
    const dy = useSpring(0, spring);

    useEffect(() => {
      dx.set(-rotateXaxis);
      dy.set(rotateYaxis);
    }, [rotateXaxis, rotateYaxis, dx, dy]);

    const currentCard = cards[currentCardIndex];

    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="relative"
          style={{
            width: props.width,
            height: props.height,
          }}
        >
          <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
            <motion.div
              key={currentCardIndex}
              onClick={handleClick}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={slideSpring}
              style={{
                width: props.width,
                height: props.height,
                position: "absolute",
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                ref={cardRef}
                whileHover={!isExiting ? { scale: 1.1 } : {}}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseEnd}
                style={{
                  width: "100%",
                  height: "100%",
                  rotateX: dx,
                  rotateY: dy,
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? -180 : 0 }}
                  transition={spring}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    zIndex: isFlipped ? 0 : 1,
                  }}
                >
                  <Component
                    {...props}
                    variant="Front"
                    card={currentCard}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: isFlipped ? 0 : 180 }}
                  transition={spring}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    zIndex: isFlipped ? 1 : 0,
                  }}
                >
                  <Component
                    {...props}
                    variant="Back"
                    card={currentCard}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };
}

// Example card component
function Card({
  variant = "Front",
  style,
  card,
}: FlipComponentProps<{ front: string; back: string }>) {
  return (
    <div
      style={{
        ...style,
        background: variant === "Front" ? "#4F46E5" : "#7C3AED",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "1rem",
      }}
    >
      <h2 className="text-xl font-bold">
        {variant === "Front" ? card.front : card.back}
      </h2>
    </div>
  );
}

export default function FlipCardRoute() {
  const data = useLoaderData<typeof loader>();
  const FlippableCard = withFlip<{ front: string; back: string }>(Card);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <FlippableCard width={300} height={200} card={cards[0]} />
    </div>
  );
}
