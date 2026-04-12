import { useEffect, useState } from "react";

export default function ChangingWord() {
  const words = ["Smart", "Easier", "Faster"];
  const colors = ["text-green-700","text-orange-500", "text-yellow-500" ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`${colors[index]} transition-all duration-500`}>
      {words[index]}
    </span>
  );
}