interface SearchProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Search({ searchParams }: SearchProps) {
  const key = searchParams.keyword as string;
  return (
    <div>
      <div>search페이지 - {key}</div>
    </div>
  );
}
