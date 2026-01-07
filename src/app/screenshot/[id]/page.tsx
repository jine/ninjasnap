import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function ScreenshotPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Screenshot Result</h1>
      <div className="text-center">
        <Image
          src={`/screenshots/${id}.png`}
          alt="Screenshot"
          width={1280}
          height={720}
          className="max-w-full h-auto border border-gray-300 rounded"
        />
      </div>
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Take Another Screenshot
        </Link>
      </div>
    </div>
  );
}