import QuestGrid from "../components/QuestGrid";
import { useNavigate } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";

export default function Home() {
  const navigate = useNavigate();

return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-accent/20"> 
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 opacity-30 rounded-full blur-3xl" />

        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400 dark:bg-purple-600 opacity-30 rounded-full blur-3xl" />

        <div className="relative z-10"> 

          <section className="flex flex-col justify-center items-center gap-4 mx-auto text-center border-2 border-border rounded-xl w-full p-6 sm:p-8 mb-6">

            <h1 className="h1-home text-fg text-left">
              Do.
              <span className="text-accent block">Outplay.</span>
              <span className="text-fg block">Rank.</span>
              <span className="text-accent block">Conquer.</span>  
            </h1>

            <p className="text-center sm:text-left text-sm sm:text-base text-fg/80 font-normal">
              Track your daily quests and conquer your day!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full justify-center sm:align-center">
              <button className="px-6 py-3 border-2 border-accent text-accent sm:w-fit rounded-md hover:bg-accent hover:text-fg transition duration-200 ease-in"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            
              <button className="
                px-6 py-3
                bg-accent text-white
                sm:w-fit
                rounded-md
                transition duration-200 ease-in-out
                hover:bg-primary
                dark:bg-accent
                dark:hover:bg-card
                dark:hover:border-accent
                dark:hover:text-fg
              "
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

          </section>
          
          <section className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-fg">Your Daily Quests</h2>
            <button className="flex items-center gap-1 text-sm text-fg hover:underline"
              onClick={() => navigate("/quest")}
            >
              View All
              <RiArrowRightLine size={18} />
            </button>
          </section>

          <QuestGrid limit={3}/>
      </div>  
    </main>
  );
}