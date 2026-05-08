import { PawPrint, Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = [
    { label: "Privacy Policy", to: "#" },
    { label: "Shipping and Returns", to: "#" },
    { label: "Data Protection", to: "#" },
];

const socials = [
    { icon: <Instagram className="h-4 w-4" />, label: "Instagram", to: "#" },
    { icon: <Facebook className="h-4 w-4" />, label: "Facebook", to: "#" },
    { icon: <Twitter className="h-4 w-4" />, label: "Twitter", to: "#" },
];

const Foot = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-200 px-6 pt-6 pb-8">
            <div className="flex flex-col items-center gap-1 mb-5">
                <div className="flex items-center gap-2">
                    <PawPrint className="text-[#f4a52c] h-6 w-6" strokeWidth={2.5} />
                    <span
                        className="text-[#f4a52c] text-2xl leading-none"
                        style={{ fontFamily: '"Caveat Brush", cursive' }}
                    >
                        dogget
                    </span>
                </div>
                <p className="text-xs text-gray-400">Everything your pup deserves.</p>
            </div>

            <div className="flex justify-center gap-4 mb-5">
                {socials.map(({ icon, label, to }) => (
                    <a
                        key={label}
                        href={to}
                        aria-label={label}
                        className="h-9 w-9 rounded-full bg-[#f4a52c]/10 flex items-center justify-center text-[#f4a52c] hover:bg-[#f4a52c] hover:text-white transition"
                    >
                        {icon}
                    </a>
                ))}
            </div>

            <div className="flex flex-col gap-2 justify-center items-center text-gray-500 text-sm mb-4">
                {footerLinks.map(({ label, to }) => (
                    <a
                        key={label}
                        href={to}
                        className="hover:text-[#f4a52c] transition cursor-pointer"
                    >
                        {label}
                    </a>
                ))}
            </div>

            <p className="text-gray-400 text-center text-xs">Dogget &copy; 2025</p>
        </footer>
    );
}

export default Foot;
