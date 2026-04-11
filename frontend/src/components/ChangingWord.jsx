import { useEffect, useState } from "react";

export default function ChangingWord() {
  const words = ["Smart", "Easier", "Faster"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-green-700 transition-all duration-500">
      {words[index]}
    </span>
  );
}