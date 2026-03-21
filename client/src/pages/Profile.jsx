import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, loggedIn } = useAuth();
    const fullName =
        user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : null;
    const navigate = useNavigate();

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-accent/20">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 opacity-30 rounded-full blur-3xl" />
            <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400 dark:bg-purple-600 opacity-30 rounded-full blur-3xl" />

            <div className="relative z-10 p-6">
                {loggedIn ? (
                    <>
                        <div className="mb-6">
                            <h1 className="text-left text-fg">Profile</h1>
                            <p className="font-light text-fg/80">
                                Manage your profile and update your personal information here.
                            </p>
                        </div>

                        <section className="grid md:grid-cols-2 lg:grid-cols-[3fr_7fr] gap-6">
                            <div className="bg-card p-4 rounded-2xl border-2 border-border md:row-span-3">
                                <h2 className="font-bold text-2xl uppercase mb-5">
                                    Personal Information
                                </h2>

                                <p className="text-fg">Full Name: {fullName || "N/A"}</p>
                                <p className="text-fg">Username: {user?.username || "N/A"}</p>
                                <p className="text-fg">Email: {user?.email || "N/A"}</p>
                            </div>

                            <div className="bg-card p-4 rounded-2xl border-2 border-border">
                                <h2 className="font-bold text-2xl uppercase mb-5">
                                    Achievements
                                </h2>
                                <p className="text-fg">
                                    View your achievements and rewards here.
                                </p>
                            </div>

                            <div className="bg-card p-4 rounded-2xl border-2 border-border">
                                <h2 className="font-bold text-2xl uppercase mb-5">
                                    Progress
                                </h2>
                                <p className="text-fg">
                                    Track your daily quests and overall progress here.
                                </p>
                            </div>

                            <div className="bg-card p-4 rounded-2xl border-2 border-border">
                                <h2 className="font-bold text-2xl uppercase mb-5">
                                    Guild
                                </h2>
                                <p className="text-fg">
                                    Join or create a guild to collaborate with other players.
                                </p>
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <h1 className="text-2xl font-semibold text-red-600 text-left">
                            You’re not signed in
                        </h1>
                        <p className="text-fg/80">
                            Sign in to view and manage your profile, track your progress, and access your account.
                        </p>

                        <button
                            className="mt-2 px-6 py-2
                                sm:w-fit
                                bg-accent text-white
                                rounded-full
                                transition duration-200 ease-in-out
                                border border-transparent
                                hover:bg-primary
                                dark:bg-accent
                                dark:hover:bg-card
                                dark:hover:border-accent
                                dark:hover:text-fg
                                dark:hover:border-white"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}