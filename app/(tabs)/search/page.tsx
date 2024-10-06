import { Metadata } from "next";
import MasonryPage from "@/components/Search";

export const generateMetadata = ({ searchParams }: { searchParams: { query: string } }): Metadata => {
  return {
    title: searchParams.query,
    description: "Semantic Search",
  };
};


const Page = ({ searchParams }: { searchParams: { query: string } }) => {
  const query = searchParams.query;

  return (
    <main>
      <MasonryPage query={query} />
    </main>
  );
};


export default Page;