import Airtable from 'airtable'

// A singleton to hold the base connection
let base: Airtable.Base | null = null;

function getBase(): Airtable.Base | null {
  // If base is already initialized, return it
  if (base) {
    return base;
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  // If credentials are not in env, log a warning and set base to null
  if (!apiKey || !baseId) {
    // This warning is helpful for debugging deployment issues.
    console.warn('Airtable API Key or Base ID is not configured. Airtable fetching will be skipped.');
    return null;
  }
  
  // Initialize Airtable and the base
  const airtable = new Airtable({ apiKey });
  base = airtable.base(baseId);
  
  return base;
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
  const currentBase = getBase();
  if (!currentBase) return [];

  try {
    const records = await currentBase('Partners').select().all()
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
  const currentBase = getBase();
  if (!currentBase) return [];

  try {
    const records = await currentBase('Projects').select().all()
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
  const currentBase = getBase();
  if (!currentBase) return [];
  try {
    const records = await currentBase('Services').select().all()
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
  const currentBase = getBase();
  if (!currentBase) {
    console.error('Airtable not configured, form submission failed.');
    return { success: false, error: 'Airtable not configured' };
  }

  try {
    await currentBase('Contact Submissions').create([
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