import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiEditBoxLine, RiCloseLine } from "react-icons/ri";

export default function Profile() {
    const { user, loggedIn } = useAuth();
    const fullName =
        user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : null;
    const navigate = useNavigate();
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Implement profile update logic here
        alert("Profile updated successfully!");
    };

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

                        <section className="grid md:grid-cols-2 lg:grid-cols-[5fr_7fr] gap-6">
                            <div className="bg-card p-4 rounded-2xl border-2 border-border md:row-span-3">
                                <div className="flex flex-col items-left sm:flex-row sm:items-center justify-between mb-5 border-b-2 border-border pb-3 gap-2">
                                <h2 className="font-bold text-2xl uppercase">
                                    Personal Information
                                </h2>

                                <button className="flex items-center justify-center rounded-full px-3 py-2 bg-primary text-white text-sm transition duration-200 ease-in-out border border-transparent
                                hover:bg-primary
                                dark:bg-accent
                                dark:hover:bg-card
                                dark:hover:border-accent
                                dark:hover:text-fg
                                dark:hover:border-white"
                                        onClick={() => setOpenUpdateModal(true)}>
                                    <RiEditBoxLine size={20}/>
                                    <span className="ml-1">Edit</span>
                                </button>
                                </div>

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

                {/* Update Profile Modal */}
                {openUpdateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
                        <div className="bg-card p-6 rounded-3xl w-full max-w-lg border-2 border-border">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Update Profile</h2>

                                <button onClick={() => setOpenUpdateModal(false)} className="text-fg/80 hover:text-fg">
                                    <RiCloseLine size={20}/>
                                </button>
                            </div>

                            <form className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-fg mb-1" htmlFor="firstName">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            defaultValue={user?.first_name || ""}
                                            className="w-full p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-fg mb-1" htmlFor="lastName">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            defaultValue={user?.last_name || ""}
                                            className="w-full p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-fg mb-1" htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        defaultValue={user?.username || ""}
                                        className="w-full p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-fg mb-1" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ""}
                                        className="w-full p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    onClick={handleUpdateProfile}
                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full transition duration-200 ease-in-out border border-transparent
                                    hover:bg-primary
                                    dark:bg-accent
                                    dark:hover:bg-card
                                    dark:hover:border-accent
                                    dark:hover:text-fg
                                    dark:hover:border-white"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}
        </main>
    );
}