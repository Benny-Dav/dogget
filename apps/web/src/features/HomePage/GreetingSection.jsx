import { Bell } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const GreetingSection = () => {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName}!` : "Hi there!";

  return (
    <section className="px-6 pt-4 pb-2 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{greeting}</p>
        <h2 className="text-lg font-bold text-gray-900">Find the best for your pup</h2>
      </div>
      <button
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-full bg-[#f4a52c]/10 flex items-center justify-center hover:bg-[#f4a52c]/20 transition"
      >
        <Bell className="h-5 w-5 text-[#f4a52c]" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>
    </section>
  );
};

export default GreetingSection;
