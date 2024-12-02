import DOMPurify from 'isomorphic-dompurify'

// prevent dom clobbering & creating forms, buttons etc.
const FORBIDDEN_TAGS = [
  'button',
  'input',
  'select',
  'textarea',
  'form',
  'label',
  'fieldset',
  'legend',
  'optgroup',
  'option',
  'datalist',
  'keygen',
  'output',
  'meter',
  'progress',
  'object',
  'embed',
]

// Having these attributes on these tags can be a security risk
// Dom Clobbering: https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Dom%20Clobbering & https://publications.cispa.saarland/3756/1/sp23_domclob.pdf
const FORBIT_ATTR = ['name']

export const sanitizeHTML = (
  html: string,
  allowAll: boolean = true,
  fullFunctionalityAllowed = false,
  allowMark?: boolean
) =>
  allowAll
    ? DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'callout-component', 'multicode-component'],
        ADD_ATTR: [
          'allow',
          'allowfullscreen',
          'frameborder',
          'scrolling',
          'color',
          'data',
          'activecode',
          'id',
        ],
        FORBID_TAGS: FORBIDDEN_TAGS.filter((tag) => {
          if (fullFunctionalityAllowed && tag === 'input') {
            return false
          }
          return true
        }),
        FORBID_ATTR: fullFunctionalityAllowed ? FORBIT_ATTR : [...FORBIT_ATTR, 'style'],
      })
    : DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowMark ? ['mark'] : [],
        FORBID_ATTR: [],
        FORBID_TAGS: FORBIDDEN_TAGS,
      })
