import { AirtableClient, AirtableClientResponse } from "./airtable/index.mjs"
import { BaseClient, BaseClientResponse } from "./base/index.mjs"
import { MailchimpClient, MailchimpClientResponse } from "./mailchimp/index.mjs"

import {
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
} from "./mailgun/index.mjs"

import { MailTmClient, MailTmClientResponse } from "./mail-tm/index.mjs"

export {
  AirtableClient,
  AirtableClientResponse,
  BaseClient,
  BaseClientResponse,
  MailchimpClient,
  MailchimpClientResponse,
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
  MailTmClient,
  MailTmClientResponse,
}
