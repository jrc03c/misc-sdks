import {
  AirtableBaseRef,
  AirtableClient,
  AirtableClientResponse,
  AirtableTableRef,
} from "./airtable/index.mjs"

import { BaseClient, BaseClientResponse } from "./base/index.mjs"

import {
  customCommaSplit,
  EmailAddressStandardizationOptions,
  GmailMessageSender,
  safeParse,
  standardizeEmailAddress,
  toNodemailerAddressFormat,
} from "./base/utils.mjs"

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
  customCommaSplit,
  EmailAddressStandardizationOptions,
  GmailMessageSender,
  MailchimpClient,
  MailchimpClientResponse,
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
  MailTmClient,
  MailTmClientResponse,
  safeParse,
  standardizeEmailAddress,
  toNodemailerAddressFormat,
}
