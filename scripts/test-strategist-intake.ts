/**
 * Acceptance tests for Protocol Strategist document intake.
 *
 * Run with:  npm run test:intake   (npx tsx scripts/test-strategist-intake.ts)
 *
 * Gates:
 *  1. Reject non-.docx (extension, PDF magic, legacy .doc).
 *  2. Reject oversized uploads (4 MB cap).
 *  3. Haiku extract mapper turns a sample brief payload into DesignBrief.
 *  4. Upload route is grant-gated (403/401 short-circuits before parse).
 *  5. Google Doc create is called with new HTML content — never an existing
 *     starter file id.
 */

import assert from 'node:assert/strict'

import { isThinExtract, normalizeExtractedBrief } from '../lib/strategistExtract'
import {
  IntakeError,
  MAX_UPLOAD_BYTES,
  intakeUploadedDocument,
  runUploadRoute,
  validateDocxUpload,
} from '../lib/strategistUpload'

let failures = 0
let checks = 0

function check(label: string, ok: boolean, detail?: string) {
  checks++
  if (!ok) {
    failures++
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
  } else {
    console.log(`  ok    ${label}`)
  }
}

// ------------------------------------------------------ 1. reject non-docx --

console.log('reject non-docx')

const zipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00])
const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])
const oleBytes = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])

function rejectReason(fn: () => void): { message: string; status?: number } | null {
  try {
    fn()
    return null
  } catch (err) {
    if (err instanceof IntakeError) return { message: err.message, status: err.status }
    throw err
  }
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'brief.pdf', bytes: pdfBytes })
  )
  check('rejects .pdf extension', Boolean(r?.message.match(/docx/i)))
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'brief.docx', bytes: pdfBytes })
  )
  check('rejects PDF magic even when named .docx', Boolean(r?.message.match(/PDF/i)))
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'brief.doc', bytes: oleBytes })
  )
  check('rejects legacy .doc', Boolean(r?.message.match(/doc/i)))
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'brief.pptx', bytes: zipBytes })
  )
  check('rejects .pptx', Boolean(r?.message.match(/docx/i)))
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'brief.docx', bytes: new Uint8Array([0x00, 0x01, 0x02]) })
  )
  check('rejects non-ZIP bytes named .docx', Boolean(r?.message.match(/valid \.docx|ZIP/i)))
}

{
  const ok = validateDocxUpload({ name: 'NSCLC-brief.docx', bytes: zipBytes })
  check('accepts a ZIP-headed .docx under the cap', ok.fileName === 'NSCLC-brief.docx')
}

// ------------------------------------------------------ 2. reject oversized --

console.log('reject oversized')

{
  const big = new Uint8Array(MAX_UPLOAD_BYTES + 1)
  big[0] = 0x50
  big[1] = 0x4b
  const r = rejectReason(() => validateDocxUpload({ name: 'huge.docx', bytes: big }))
  check('rejects bytes over 4 MB', r?.status === 413)
  check('oversized message names the cap', Boolean(r?.message.match(/4 MB/i)))
}

{
  const r = rejectReason(() =>
    validateDocxUpload({ name: 'huge.docx', size: MAX_UPLOAD_BYTES + 10, bytes: zipBytes })
  )
  check('rejects declared size over 4 MB even if buffer is small', r?.status === 413)
}

{
  const r = rejectReason(() => validateDocxUpload({ name: 'empty.docx', bytes: new Uint8Array() }))
  check('rejects empty file', Boolean(r?.message.match(/empty/i)))
}

// -------------------------------------- 3. extract maps sample into schema --

console.log('extract maps a sample brief into schema')

const sampleExtract = {
  title: 'Phase 2 Study of TCX-LUNG in Second-Line Metastatic NSCLC',
  therapeutic_area: 'Oncology',
  disease_area: 'Thoracic Oncology',
  indication: 'Advanced Non-Small Cell Lung Cancer',
  line_of_treatment: 'Second Line',
  phase: '2',
  target_enrollment: 180,
  planned_sites: 48,
  randomization: '1:1, stratified by prior PD-(L)1',
  arms: [
    { name: "Arm A — TCX-LUNG + investigator's-choice chemotherapy" },
    { name: "Arm B — Investigator's-choice chemotherapy" },
  ],
  primary_endpoint: {
    text: 'Progression-free survival (PFS) per RECIST v1.1',
    assessment: 'PFS per RECIST v1.1',
  },
  secondary_endpoints: [{ text: 'Overall survival (OS)', assessment: 'OS' }],
  criteria: [
    { type: 'Inclusion', text: 'Histologically confirmed metastatic NSCLC', category: 'Diagnosis' },
    { type: 'Exclusion', text: 'Untreated CNS metastases', category: 'Medical History' },
  ],
  soa_sketch: [
    'Screening Day −28 to −1',
    'Treatment 21-day cycles',
    'Imaging every 6 weeks through Week 48',
  ],
  coverage: { present: ['indication', 'phase', 'arms', 'primary_endpoint', 'eligibility', 'soa', 'enrollment', 'sites'], missing: [] },
}

{
  const { brief, coverage } = normalizeExtractedBrief(sampleExtract, {
    fileName: 'tcx-lung.docx',
    briefId: 'UPLOAD-test',
  })
  check('brief_id preserved', brief.brief_id === 'UPLOAD-test')
  check('indication mapped', brief.indication === 'Advanced Non-Small Cell Lung Cancer')
  check('phase mapped', brief.phase === '2')
  check('two arms', brief.arms.length === 2)
  check('arm ids assigned', brief.arms.every((a) => Boolean(a.id) && Boolean(a.name)))
  check('primary endpoint text', /PFS/i.test(brief.primary_endpoint.text))
  check('inclusion + exclusion', brief.criteria.length === 2 && brief.criteria[0].type === 'Inclusion')
  check('SoA sketch kept', brief.soa_sketch.length === 3)
  check('enrollment mapped', brief.target_enrollment === 180)
  check('sites mapped', brief.planned_sites === 48)
  check('coverage marks present fields', coverage.present.includes('arms') && coverage.present.includes('eligibility'))
  check('full extract is not thin', isThinExtract(brief, coverage) === false)
}

{
  const { brief, coverage } = normalizeExtractedBrief(
    { title: 'Notes', indication: '', phase: '', arms: [], criteria: [], soa_sketch: [] },
    { fileName: 'thin.docx' }
  )
  check('thin extract leaves empty arms', brief.arms.length === 0)
  check('thin extract flagged', isThinExtract(brief, coverage) === true)
  check('missing list includes arms and eligibility', coverage.missing.includes('arms') && coverage.missing.includes('eligibility'))
}

{
  const { brief } = normalizeExtractedBrief({
    indication: 'Asthma',
    phase: '3',
    target_enrollment: 'not-a-number',
    planned_sites: -4,
    arms: [{ name: 'Drug X' }, null, { name: '' }],
    primary_endpoint: { text: 'FEV1' },
    criteria: [{ type: 'Inclusion', text: 'Age ≥ 18' }],
    soa_sketch: ['Screening', 12, ''],
  })
  check('coerces bad enrollment to 0', brief.target_enrollment === 0)
  check('drops negative sites', brief.planned_sites === 0)
  check('drops empty/null arms', brief.arms.length === 1 && brief.arms[0].name === 'Drug X')
  check('drops non-string SoA rows', brief.soa_sketch.length === 1 && brief.soa_sketch[0] === 'Screening')
}

async function asyncCases() {
// ------------------------------------------ 4. upload route is grant-gated --

console.log('upload route is grant-gated')

async function jsonOf(res: Response): Promise<{ error?: string }> {
  return (await res.json()) as { error?: string }
}

{
  const res = await runUploadRoute({
    checkGrant: async () =>
      Response.json({ error: 'Your account is not authorized for this workspace.' }, { status: 403 }),
    getUserEmail: async () => {
      throw new Error('getUserEmail must not run when grant is denied')
    },
    formData: async () => {
      throw new Error('formData must not run when grant is denied')
    },
    intake: async () => {
      throw new Error('intake must not run when grant is denied')
    },
  })
  const body = await jsonOf(res)
  check('403 when grant denied', res.status === 403)
  check('denied body names authorization', Boolean(body.error?.match(/not authorized/i)))
}

{
  const res = await runUploadRoute({
    checkGrant: async () => Response.json({ error: 'Sign in to use this workspace.' }, { status: 401 }),
    getUserEmail: async () => {
      throw new Error('getUserEmail must not run when unsigned-in')
    },
    formData: async () => {
      throw new Error('formData must not run when unsigned-in')
    },
    intake: async () => {
      throw new Error('intake must not run when unsigned-in')
    },
  })
  check('401 when unsigned-in', res.status === 401)
}

{
  let intakeCalled = false
  const form = new FormData()
  form.set('file', new File([Buffer.from(zipBytes)], 'ok.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))
  const res = await runUploadRoute({
    checkGrant: async () => null,
    getUserEmail: async () => 'reviewer@example.com',
    formData: async () => form,
    intake: async (opts) => {
      intakeCalled = true
      return {
        brief: normalizeExtractedBrief(sampleExtract).brief,
        coverage: { present: ['indication'], missing: [] },
        sourceText: null,
        thin: false,
        doc: { id: 'NEW1', name: opts.fileName, webViewLink: 'https://docs.google.com/document/d/NEW1/edit' },
        shared: true,
        fileName: opts.fileName,
      }
    },
  })
  check('granted request reaches intake', intakeCalled && res.status === 200)
}

{
  const form = new FormData()
  form.set('file', new File([Buffer.from(pdfBytes)], 'nope.pdf'))
  const res = await runUploadRoute({
    checkGrant: async () => null,
    getUserEmail: async () => 'reviewer@example.com',
    formData: async () => form,
    intake: async () => {
      throw new Error('intake must not run for a rejected file')
    },
  })
  check('granted but non-docx still 400', res.status === 400)
}

// -------------- 5. createDoc called with new content, not a starter id ------

console.log('Google Doc create is a new working copy')

const STARTER_IDS = [
  process.env.STRATEGIST_BRIEF_DOC_ID,
  'NSCLC-2L-DESIGN-BRIEF',
  '1starterHeroBriefId',
  'TCX-LUNG',
].filter((x): x is string => Boolean(x))

{
  const created: { title?: string; html?: string } = {}
  const createKeys: string[] = []
  const sharedWith: { id?: string; email?: string } = {}
  const html = '<h1>Phase 2 NSCLC design brief</h1><p>Target N=180</p>'
  const result = await intakeUploadedDocument({
    bytes: Buffer.from(zipBytes),
    fileName: 'my-sponsor-brief.docx',
    shareWith: 'uploader@sponsor.org',
    deps: {
      parseDocx: async () => ({ html, text: 'Phase 2 NSCLC design brief. Target N=180.' }),
      extractBrief: async () => {
        const mapped = normalizeExtractedBrief(sampleExtract, { briefId: 'UPLOAD-live' })
        return { ...mapped, sourceText: null, thin: false, model: 'claude-haiku-4-5-20251001' }
      },
      createDoc: async (opts) => {
        created.title = opts.title
        created.html = opts.html
        createKeys.push(...Object.keys(opts))
        return { id: 'NEW_WORKING_COPY_ID', name: opts.title, webViewLink: 'https://docs.google.com/document/d/NEW_WORKING_COPY_ID/edit' }
      },
      shareDoc: async (id, email) => {
        sharedWith.id = id
        sharedWith.email = email
      },
    },
  })

  check('createDoc was called', Boolean(created.title && created.html))
  check(
    'createDoc title is a working copy of the upload, not a starter',
    Boolean(created.title && /my-sponsor-brief/i.test(created.title) && /working copy/i.test(created.title))
  )
  check('createDoc html is the parsed upload', created.html === html)
  check(
    'createDoc was not given an existing starter id',
    !createKeys.includes('id') && !createKeys.includes('fileId')
  )
  check(
    'returned doc id is the new copy',
    result.doc.id === 'NEW_WORKING_COPY_ID' && !STARTER_IDS.includes(result.doc.id)
  )
  check('shared with the uploading user', sharedWith.email === 'uploader@sponsor.org' && sharedWith.id === 'NEW_WORKING_COPY_ID')
}

{
  const form = new FormData()
  form.set(
    'file',
    new File([Buffer.from(zipBytes)], 'sponsor.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
  )
  let createCalledWithStarter = false
  const res = await runUploadRoute({
    checkGrant: async () => null,
    getUserEmail: async () => 'uploader@sponsor.org',
    formData: async () => form,
    intake: async (opts) => {
      const created = await intakeUploadedDocument({
        ...opts,
        deps: {
          parseDocx: async () => ({ html: '<p>Sponsor brief</p>', text: 'Sponsor brief' }),
          extractBrief: async () => {
            const mapped = normalizeExtractedBrief(sampleExtract)
            return { ...mapped, sourceText: null, thin: false, model: 'test' }
          },
          createDoc: async (args) => {
            if (STARTER_IDS.some((id) => JSON.stringify(args).includes(id))) {
              createCalledWithStarter = true
            }
            return { id: 'DOC_FROM_ROUTE', name: args.title, webViewLink: 'https://docs.google.com/document/d/DOC_FROM_ROUTE/edit' }
          },
          shareDoc: async () => {},
        },
      })
      return created
    },
  })
  const body = (await res.json()) as { doc?: { id?: string } }
  check('route create path returns a new doc id', res.status === 200 && body.doc?.id === 'DOC_FROM_ROUTE')
  check('route create path never referenced a starter id', createCalledWithStarter === false)
}

}

asyncCases()
  .then(() => {
    console.log(`\n${checks - failures}/${checks} checks passed`)
    if (failures) process.exit(1)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
