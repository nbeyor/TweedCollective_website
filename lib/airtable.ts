import Airtable from 'airtable'

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
})

const base = airtable.base(process.env.AIRTABLE_BASE_ID || '')

// Types for your data
export interface Partner {
  id: string
  name: string
  title: string
  company: string
  bio: string
  image?: string
  linkedin?: string
  expertise: string[]
}

export interface Project {
  id: string
  name: string
  category: string
  headline: string
  challenge: string
  approach: string
  impact: string[]
  tags: string[]
  logo?: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  features: string[]
  outcomes: string[]
}

// Helper functions to fetch data
export const getPartners = async (): Promise<Partner[]> => {
  try {
    const records = await base('Partners').select().all()
    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      title: record.get('Title') as string,
      company: record.get('Company') as string,
      bio: record.get('Bio') as string,
      image: record.get('Image') as string,
      linkedin: record.get('LinkedIn') as string,
      expertise: record.get('Expertise') as string[] || [],
    }))
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const records = await base('Projects').select().all()
    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      category: record.get('Category') as string,
      headline: record.get('Headline') as string,
      challenge: record.get('Challenge') as string,
      approach: record.get('Approach') as string,
      impact: record.get('Impact') as string[] || [],
      tags: record.get('Tags') as string[] || [],
      logo: record.get('Logo') as string,
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const records = await base('Services').select().all()
    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      description: record.get('Description') as string,
      category: record.get('Category') as string,
      features: record.get('Features') as string[] || [],
      outcomes: record.get('Outcomes') as string[] || [],
    }))
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

// Contact form submission
export const submitContactForm = async (data: {
  name: string
  email: string
  company: string
  message: string
  service?: string
}) => {
  try {
    await base('Contact Submissions').create([
      {
        fields: {
          Name: data.name,
          Email: data.email,
          Company: data.company,
          Message: data.message,
          Service: data.service || '',
          Date: new Date().toISOString(),
        },
      },
    ])
    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error }
  }
} 