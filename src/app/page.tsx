import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-1/10 rounded bg-slate-50 flex flex-col">
      <div className="py-10 px-10">
        Start Project 1
      </div>
      <div className="space-x-4">
        <Link
          href="/projects/continue" 
          className="px-10 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 bg-opacity-50"
        >
          Continue Project
        </Link>
        <Link
          href="/projects/new" 
          className="px-10 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 bg-opacity-50"
        >
          Start Project
        </Link>
      </div>
    </div>
  );
}
