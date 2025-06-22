import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Project = {
  name: string;
  repo: string;
  date: string;
};

const projects: Project[] = [
  { name: "Project 1", repo: "", date: "2025-06-18" },
  { name: "Project 2", repo: "", date: "2025-06-29" },
  { name: "Project 3", repo: "", date: "2025-07-06" },
  { name: "Project 4", repo: "", date: "2025-07-13" },
  { name: "Project 5", repo: "", date: "2025-07-20" },
  { name: "Project 6", repo: "", date: "2025-07-27" },
  { name: "Project 7", repo: "", date: "2025-08-03" },
  { name: "Project 8", repo: "", date: "" },
  { name: "Project 9", repo: "", date: "" },
  { name: "Project 10", repo: "", date: "" },
  { name: "Project 11", repo: "", date: "" },
  { name: "Project 12", repo: "", date: "" },
];

function ChannelPage() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes.toString().padStart(2, "0");

    return { hours, minutes: formattedMinutes, ampm };
  };

  const formatDate = (date: Date) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed

    return `${dayOfWeek} ${day}/${month}`;
  };

  const { hours, minutes, ampm } = formatTime(time);
  const dateString = formatDate(time);

  return (
    <div className="flex font-wii cursor-wii min-h-screen flex-col bg-[repeating-linear-gradient(to_bottom,#F8F8F8_0px,#F8F8F8_8px,transparent_8px,transparent_10px)]">
      <div className="flex-1 grid grid-cols-4 gap-[25px] p-12">
        {projects.map(({ name, date }) =>
          Date.parse(date) <= Date.now() ? (
            <div
              className="rounded-[20px] border-4 border-[#C3C3C3] bg-[#F7F7F7]"
              key={name}
            >
              Insert Project
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-[20px] border-4 border-[#C3C3C3] bg-[rgb(231_231_231/60%)] text-[rgb(121_121_121/50%)] text-[26px]">
              Upcoming...
            </div>
          )
        )}
      </div>

      <div className="h-[200px] flex relative">
        <div
          className="w-[300px] h-full bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: "url(/wii_assets/footer_l.svg)" }}
        />

        <div
          className="flex-1 h-full bg-repeat-x"
          style={{
            backgroundImage: "url(/wii_assets/footer_c.png)",
            backgroundPosition: "bottom",
          }}
        />

        <div
          className="w-[300px] h-full bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: "url(/wii_assets/footer_r.svg)" }}
        />

        <div className="absolute inset-0 flex justify-between items-center px-12">
          <button
            className="transition-all duration-200 hover:scale-110 cursor-wii"
            onClick={() => navigate("/")}
          >
            <img
              src="/wii_assets/home_button.png"
              alt="home"
              className="w-28 h-28"
            />
          </button>

          <div className="flex flex-col items-center justify-around">
            <div className="flex items-center gap-2 text-gray-600 text-3xl font-light tracking-wider">
              <span>{hours}</span>
              <span className="text-4xl opacity-70 animate-flash">:</span>
              <span>{minutes}</span>
              <span className="text-sm font-normal align-text-bottom">
                {ampm}
              </span>
            </div>

            <div className="text-gray-600 text-4xl font-light tracking-wide mt-5">
              {dateString}
            </div>
          </div>

          <button
            className="transition-all duration-200 hover:scale-110 cursor-wii"
            onClick={() => window.open("mailto:jarydnoahdiamond@gmail.com")}
          >
            <img
              src="/wii_assets/mail_button.png"
              alt="mail"
              className="w-28 h-28"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;
