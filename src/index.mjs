import {
  AirtableBaseRef,
  AirtableClient,
  AirtableClientResponse,
  AirtableTableRef,
} from "./airtable/index.mjs"

import { BaseClient, BaseClientResponse } from "./base/index.mjs"
import { BeehiivClient, BeehiivClientResponse } from "./beehiiv/index.mjs"

import { GmailMessageSender } from "./base/utils.mjs"

import { MailchimpClient, MailchimpClientResponse } from "./mailchimp/index.mjs"

import {
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
} from "./mailgun/index.mjs"

import { MailTmClient, MailTmClientResponse } from "./mail-tm/index.mjs"

export {
  AirtableBaseRef,
  AirtableClient,
  AirtableClientResponse,
  AirtableTableRef,
  BaseClient,
  BaseClientResponse,
  BeehiivClient,
  BeehiivClientResponse,
  GmailMessageSender,
  MailchimpClient,
  MailchimpClientResponse,
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
  MailTmClient,
  MailTmClientResponse,
}
