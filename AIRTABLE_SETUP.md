# Airtable Integration Setup

This guide will help you connect your Tweed Collective website to Airtable for dynamic content management.

## 🚀 Quick Setup

### 1. Get Your Airtable Credentials

1. **Go to [Airtable](https://airtable.com)** and sign in
2. **Create a new base** or use an existing one
3. **Get your API Key**:
   - Go to your [Airtable account page](https://airtable.com/account)
   - Click "Generate API key"
   - Copy the key (starts with `key...`)

4. **Get your Base ID**:
   - Open your Airtable base
   - Go to Help → API Documentation
   - Copy the Base ID (starts with `app...`)

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Airtable Configuration
AIRTABLE_API_KEY=key1234567890abcdef
AIRTABLE_BASE_ID=app1234567890abcdef
```

### 3. Create Your Airtable Tables

Create these tables in your Airtable base:

#### **Partners Table**
| Field Name | Type | Description |
|------------|------|-------------|
| Name | Single line text | Partner's full name |
| Title | Single line text | Job title |
| Company | Single line text | Company name |
| Bio | Long text | Biography |
| Image | URL | Profile image URL |
| LinkedIn | URL | LinkedIn profile |
| Expertise | Multiple select | Areas of expertise |

#### **Projects Table**
| Field Name | Type | Description |
|------------|------|-------------|
| Name | Single line text | Project name |
| Category | Single select | Operations/Advisory/Incubation |
| Headline | Single line text | Project headline |
| Challenge | Long text | Problem description |
| Approach | Long text | Solution approach |
| Impact | Multiple select | Results achieved |
| Tags | Multiple select | Project tags |
| Logo | URL | Company logo |

#### **Contact Submissions Table**
| Field Name | Type | Description |
|------------|------|-------------|
| Name | Single line text | Contact name |
| Email | Email | Contact email |
| Company | Single line text | Company name |
| Message | Long text | Contact message |
| Service | Single select | Service interested in |
| Date | Date | Submission date |

### 4. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**:
   - Partners: `http://localhost:3000/api/partners`
   - Projects: `http://localhost:3000/api/projects`
   - Contact: `POST http://localhost:3000/api/contact`

## 📝 Usage Examples

### Fetch Partners Data
```tsx
import { usePartners } from '@/hooks/useAirtable'

function PartnersPage() {
  const { partners, loading, error } = usePartners()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {partners.map(partner => (
        <div key={partner.id}>
          <h3>{partner.name}</h3>
          <p>{partner.title} at {partner.company}</p>
        </div>
      ))}
    </div>
  )
}
```

### Submit Contact Form
```tsx
import { useContactForm } from '@/hooks/useAirtable'

function ContactForm() {
  const { submitForm, loading, error, success } = useContactForm()

  const handleSubmit = async (formData) => {
    try {
      await submitForm(formData)
      // Form submitted successfully
    } catch (err) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  )
}
```

## 🔧 Customization

### Add New Tables
1. Create the table in Airtable
2. Add the interface in `lib/airtable.ts`
3. Create a fetch function
4. Add an API route in `app/api/`
5. Create a hook in `hooks/useAirtable.ts`

### Modify Field Names
Update the field mappings in `lib/airtable.ts` to match your Airtable column names.

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check your API key is correct
   - Ensure the key has access to your base

2. **"Base not found"**
   - Verify your Base ID is correct
   - Check the base exists and is accessible

3. **"Field not found"**
   - Ensure field names in `lib/airtable.ts` match your Airtable columns exactly
   - Check field types match (text, select, etc.)

4. **CORS errors**
   - API routes are server-side, so CORS shouldn't be an issue
   - Check your environment variables are loaded

### Debug Mode
Add this to see detailed error messages:
```tsx
console.log('Airtable response:', data)
```

## 📚 Additional Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Airtable JavaScript SDK](https://github.com/Airtable/airtable.js)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables in production
- Consider rate limiting for API endpoints
- Validate all form inputs before sending to Airtable 