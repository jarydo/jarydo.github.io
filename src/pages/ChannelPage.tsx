import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Project = {
  name: string;
  repo: string;
  date: string;
  img?: string;
};

const projects: Project[] = [
  {
    name: "Scratch Away",
    repo: "scratch-away",
    date: "2025-06-22",
    img: "/scratch_away.png",
  },
  {
    name: "Curiosity Cards",
    repo: "curiosity-cards",
    date: "2025-06-29",
    img: "/curiosity_cards.png",
  },
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleWindowResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

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

    return `${dayOfWeek} ${month}/${day}`;
  };

  const { hours, minutes, ampm } = formatTime(time);
  const dateString = formatDate(time);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-chessboard font-macos">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Uh oh!</h1>
          <p className="text-gray-600 mb-4">
            This page is not on mobile (yet). Sorry!
          </p>
          <button
            className="px-4 py-2 bg-black text-white rounded "
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex font-wii cursor-wii min-h-screen flex-col bg-[repeating-linear-gradient(to_bottom,#F8F8F8_0px,#F8F8F8_8px,transparent_8px,transparent_10px)]">
      <div className="flex-1 grid grid-cols-4 gap-[25px] p-12">
        {projects.map(({ name, date, repo, img }) =>
          Date.parse(date) <= Date.now() ? (
            <div
              className="rounded-[20px] h-40 border-4 border-[#C3C3C3] bg-[#F7F7F7] transition-all duration-300 hover:border-[#36BFED] hover:shadow-[0_0_20px_rgba(54,191,237,0.5)] overflow-hidden"
              key={name}
              onClick={() => navigate(`/channel/${repo}`)}
            >
              <img
                src={img || "/wii_assets/default_project.png"}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center h-40 justify-center rounded-[20px] border-4 border-[#C3C3C3] bg-[rgb(231_231_231/60%)] text-[rgb(121_121_121/50%)] text-[26px]">
              {Date.parse(date) <= Date.now() + 7 * 24 * 60 * 60 * 1000 ? (
                <b>{`Releases ${date}`}</b>
              ) : (
                "Upcoming..."
              )}
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

          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex items-center gap-2 text-gray-600 text-4xl font-light tracking-wider">
              <span>{hours}</span>
              <span className="text-4xl opacity-70 animate-flash">:</span>
              <span>{minutes}</span>
              <span className="text-sm font-normal align-text-bottom">
                {ampm}
              </span>
            </div>

            <div className="text-gray-600 text-4xl font-light tracking-wide mb-12">
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
