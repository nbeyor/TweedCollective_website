import Airtable from 'airtable'

// A singleton to hold the base connection
let base: Airtable.Base | null = null;

function getBase(): Airtable.Base | null {
  // If base is already initialized, return it
  if (base) {
    return base;
  }

  const apiKey = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE;

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

// New types for operators and updated projects
export interface Operator {
  id: string;
  name: string;
  linkedin: string;
  photo?: string;
  expertise: string[];
}

export interface ProjectRecord {
  id: string;
  company: string;
  pillar: string;
  headline: string;
  operators: string[];
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

// Fetches all records from the "Operators" table.
export const getOperators = async (): Promise<Operator[]> => {
  const currentBase = getBase();
  if (!currentBase) return [];

  try {
    const records = await currentBase('Operators').select().all();
    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      linkedin: record.get('LinkedIn') as string,
      photo: ((record.get('Headshot') as any[])?.[0]?.url) || (record.get('HeadshotURL') as string) || undefined,
      expertise: (record.get('ExpertiseTags') as string[]) ?? [],
    }));
  } catch (error) {
    console.error('Error fetching operators:', error);
    return [];
  }
}

// New function to get project records
export const getProjectRecords = async (): Promise<ProjectRecord[]> => {
  const currentBase = getBase();
  if (!currentBase) return [];

  try {
    const records = await currentBase('Projects').select().all();
    return records.map(record => ({
      id: record.id,
      company: record.get('Company') as string,
      pillar: record.get('Pillar') as string,
      headline: record.get('Headline') as string,
      operators: (record.get('Operators') as string[]) ?? [],
    }));
  } catch (error) {
    console.error('Error fetching project records:', error);
    return [];
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