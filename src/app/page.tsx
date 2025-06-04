// app/page.tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getPosts, Post } from '../../src/sanity/lib/backend/usePost'

export default async function Home() {
  const posts: Post[] = await getPosts()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <li
            key={post._id}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(600).height(400).fit('crop').url()}
                alt={post.mainImage.alt || post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              <a
                href={`/blog/${post.slug.current}`}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {post.title}
              </a>
              {post.author && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(32).height(32).url()}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
