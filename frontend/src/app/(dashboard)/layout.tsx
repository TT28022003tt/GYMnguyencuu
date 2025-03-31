import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "../components/Menu";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex">
		<div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
			<Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
				<FontAwesomeIcon icon={faDumbbell} className="w-8 h-8 text-[#f97000]" transform={{rotate:45}}/>
				<span className="hidden lg:block font-bold text-center text-sm">ANH EM FREE FIRE SỐNG DAI NHƯ QUỶ</span>
			</Link>
			<Menu/>
		</div>
		<div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">
		{children}
		</div>
	</div>
  );
}
