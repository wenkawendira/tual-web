// app/post/[slug]/page.tsx
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { getPostBySlug, getAllPostSlugs, PostDetail } from '../../../sanity/lib/backend/getPostBySlug'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((post: any) => ({
    slug: post.slug.current,
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post: PostDetail | null = await getPostBySlug(params.slug)

  if (!post) {
    return <p>Post not found</p>
  }

  return (
    <article className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

      {/* Author & Date */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        {post.author?.image && (
          <Image
            src={urlFor(post.author.image).width(40).height(40).url()}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p>{post.author?.name}</p>
          <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Image */}
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).width(800).height(400).fit('crop').url()}
          alt={post.mainImage.alt || post.title}
          className="mb-6 rounded-lg"
        />
      )}

      {/* Categories */}
        {post.categories?.length ? (
        <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Categories:</p>
            <ul className="flex gap-2 flex-wrap">
            {post.categories.map((cat) => (
                <li
                key={cat.slug.current}
                className="bg-gray-200 text-black text-sm px-3 py-1 rounded-full"
                >
                {cat.title}
                </li>
            ))}
            </ul>
        </div>
        ) : null}


      {/* Body */}
      <div className="prose max-w-none mt-6">
        <PortableText value={post.body} />
      </div>
    </article>
  )
}
