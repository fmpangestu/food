import React, { useEffect, useState } from "react";

interface GreetingTimeProps {
  name?: string;
  className?: string;
  nameClassName?: string;
}

const GreetingTime: React.FC<GreetingTimeProps> = ({
  name,
  className,
  nameClassName,
}) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const date = new Date();

      let hour = date.getUTCHours() + 7;
      if (hour >= 24) hour -= 24;
      if (hour >= 5 && hour < 11) return "Pagi";
      if (hour >= 11 && hour < 15) return "Siang";
      if (hour >= 15 && hour < 18) return "Sore";
      return "Malam";
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className={className}>
      <div>Selamat {greeting}</div>
      {name && <div className={nameClassName}>{name}</div>}
    </div>
  );
};

export default GreetingTime;
