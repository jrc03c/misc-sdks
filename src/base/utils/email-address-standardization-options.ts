const DEFAULT_EMAIL_ADDRESS_STANDARDIZATION_OPTIONS = {
  shouldConvertDomainToPunycode: false,
  shouldRemoveDiacriticalMarksInUsername: true,
  shouldRemovePeriodsInUsername: false,
  shouldRemoveTagsInUsername: false,
}

interface EmailAddressStandardizationOptions {
  shouldConvertDomainToPunycode?: boolean
  shouldRemoveDiacriticalMarksInUsername?: boolean
  shouldRemovePeriodsInUsername?: boolean
  shouldRemoveTagsInUsername?: boolean
}

export {
  DEFAULT_EMAIL_ADDRESS_STANDARDIZATION_OPTIONS,
  EmailAddressStandardizationOptions,
}
