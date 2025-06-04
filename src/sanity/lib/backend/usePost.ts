// lib/usePosts.ts
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: true,
})

export type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  mainImage?: {
    asset: { _id: string; url: string }
    alt?: string
  }
  author?: {
    name: string
    image?: any
  }
}

export async function getPosts(): Promise<Post[]> {
  return await client.fetch(groq`
    *[_type == "post"] | order(publishedAt desc)[0...10] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      author->{
        name,
        image
      }
    }
  `)
}
