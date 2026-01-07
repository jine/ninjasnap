import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function ScreenshotPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400 flex items-center justify-center gap-2">
        🥷 Capture Complete
      </h1>
      <div className="text-center bg-gray-900 p-4 rounded-lg border border-gray-600">
        <Image
          src={`/screenshots/${id}.png`}
          alt="NinjaSnap Screenshot"
          width={1280}
          height={720}
          className="max-w-full h-auto rounded shadow-lg border border-gray-600"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEB//EACUQAAIBAwMEAwEBAAAAAAAAAAECAwAEEQUSITFBURNhcZEigf/EABUBAFEAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A4+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        >
          🎯 Take Another Screenshot
        </Link>
      </div>
    </div>
  );
}
