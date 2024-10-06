import VisualSearch from "@/components/VisualSearch";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Visual Search",
  description: "Visual Search",
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <VisualSearch id={id} />
  )
}

export default Page;