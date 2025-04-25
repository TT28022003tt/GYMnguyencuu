import ShoppingBar from "@/app/components/ShoppingBar";
import Image from "next/image";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="flex justify-center">
		<div className="flex justify-center w-[70%]">
			<div className="w-2/3">
				{children}
			</div>
			<div className="w-1/3 ">
				<div className="sticky top-[75px] flex flex-col">
					<ShoppingBar />
				</div>
			</div>
		</div>
	</div>
}