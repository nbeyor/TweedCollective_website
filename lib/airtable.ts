import Airtable from 'airtable'

const airtable_api_key = process.env.AIRTABLE_API_KEY
const airtable_base_id = process.env.AIRTABLE_BASE_ID

let base: Airtable.Base;
if (airtable_api_key && airtable_base_id) {
  const airtable = new Airtable({ apiKey: airtable_api_key });
  base = airtable.base(airtable_base_id);
}

const handleAirtableError = (err: any, type: string) => {
    console.error(`Error with Airtable ${type}: ${err.message || 'unknown error'}`);
}

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
  outcomes: string[]
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

const checkAirtableConfig = () => {
    if (!base) {
        console.warn('Airtable API key or Base ID not configured. Returning empty data.');
        return false;
    }
    return true;
}

// Helper functions to fetch data
export const getPartners = async (): Promise<Partner[]> => {
  if (!checkAirtableConfig()) return [];
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
      outcomes: record.get('Outcomes') as string[] || [],
    }))
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export const getProjects = async (): Promise<Project[]> => {
  if (!checkAirtableConfig()) return [];
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
  if (!checkAirtableConfig()) return [];
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
  if (!checkAirtableConfig()) return { success: false, error: 'Airtable not configured' };
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