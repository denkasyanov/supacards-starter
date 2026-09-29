import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion, useSpring } from "motion/react";
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

interface BaseFlipProps {
  width?: string | number;
  height?: string | number;
  variant?: "Front" | "Back";
  style?: React.CSSProperties;
}

// Generic type T represents the data structure you want to pass to the card
interface FlipComponentProps<T> extends BaseFlipProps {
  data?: T;
}

const card = {
  front: "Front Side 2",
  back: "Back Side 2",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    // Add any data you want to load from the server
  });
};

export function withFlip<T>(
  Component: ComponentType<FlipComponentProps<T>>
): ComponentType<FlipComponentProps<T>> {
  return (props) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [rotateXaxis, setRotateXaxis] = useState(0);
    const [rotateYaxis, setRotateYaxis] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = () => {
      setIsFlipped((prevState) => !prevState);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const element = ref.current;
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

    return (
      <motion.div
        onClick={handleClick}
        transition={spring}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          width: props.width,
          height: props.height,
        }}
      >
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseEnd}
          transition={spring}
          style={{
            width: "100%",
            height: "100%",
            rotateX: dx,
            rotateY: dy,
          }}
        >
          <div
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
              width: "100%",
              height: "100%",
            }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? -180 : 0 }}
              transition={spring}
              style={{
                width: "100%",
                height: "100%",
                zIndex: isFlipped ? 0 : 1,
                backfaceVisibility: "hidden",
                position: "absolute",
              }}
            >
              <Component
                {...props}
                variant="Front"
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
                zIndex: isFlipped ? 1 : 0,
                backfaceVisibility: "hidden",
                position: "absolute",
              }}
            >
              <Component
                {...props}
                variant="Back"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
}

// Example card component to demonstrate the flip effect
function Card({
  variant = "Front",
  style,
  card,
}: FlipComponentProps<typeof Card>) {
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
  const FlippableCard = withFlip<typeof card>(Card);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <FlippableCard width={300} height={200} card={card} />
    </div>
  );
}
