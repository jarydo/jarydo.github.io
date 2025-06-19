const projects = [
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

function ProjectsPage() {
  return (
    <div className="font-wii min-h-screen flex bg-[repeating-linear-gradient(to_bottom,#F8F8F8_0px,#F8F8F8_8px,transparent_8px,transparent_10px)]">
      <div className="flex-1 grid grid-cols-4 gap-[25px]">
        {projects.map(({ name, date }) =>
          Date.parse(date) <= Date.now() ? (
            <div
              className="rounded-[20px] border-4 border-[#C3C3C3] bg-[#F7F7F7]"
              key={name}
            >
              {date}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-[20px] border-4 border-[#C3C3C3] bg-[rgb(231_231_231/60%)] text-[rgb(121_121_121/50%)] text-[26px]">
              Upcoming...
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
