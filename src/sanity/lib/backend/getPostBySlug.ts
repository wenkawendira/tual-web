// lib/getPostBySlug.ts
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: true,
})

export type PostDetail = {
  title: string
  body: any
  publishedAt: string
  mainImage?: {
    asset: { _id: string; url: string }
    alt?: string
  }
  author?: {
    name: string
    image?: any
  }
  categories?: { title: string; slug: { current: string } }[]
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const query = groq`
    *[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      publishedAt,
      mainImage {
        asset -> {
          _id,
          url
        },
        alt
      },
      author -> {
        name,
        image
      },
      categories[]->{
        title,
        slug
      }
    }
  `
  return await client.fetch(query, { slug })
}

export async function getAllPostSlugs() {
  const query = groq`*[_type == "post"]{ slug }`
  return await client.fetch(query)
}
