import useSWR, { KeyedMutator } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { IChangelog, IChangelogFilters, IChangelogPaginate } from '../interfaces/IChangelog'
import {
  IMember,
  IClickupAutomaticPushRules,
  IClickupSyncRule,
  ILinearSyncRule,
  INotification,
  INotificationPaginate,
  IOrganization,
  IOrganizationChurnData,
  IOrganizationPaginate,
  ISubmissionSavedFilter,
  IGithubSyncRule,
  IGithubAutomaticPushRules,
} from '../interfaces/IOrganization'
import useSWRInfinite from 'swr/infinite'
import { defaultFetcher } from '../../network/apiClient'
import { ISubmission } from '@/interfaces/ISubmission'
import { IAdvancedSurvey, ISurveyStatisticsResponse } from '@/interfaces/ISurvey'

export function useUserOrganizations(doNotFetch?: boolean) {
  const { data, error, mutate } = useSWR(
    doNotFetch ? null : `/v1/organization/admin/orgs?limit=10000`
  )
  return {
    orgResults: data as IOrganizationPaginate,
    isOrganizationsLoading: !error && !data,
    isOrganizationsError: error,
    mutateOrganizations: mutate,
  }
}

export function usePendingModerationCount() {
  const { data, error, mutate } = useSWR(`/v1/organization/moderate/pending`)
  return {
    pendingCount: data as {
      postCount: number
      commentCount: number
      total: number
    },
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useUsedCustomFields() {
  const { data, error, mutate } = useSWR(`/v1/organization/usedCustomFields`)
  return {
    usedCustomFields: data?.result as {
      userCustomFields: string[]
      companyCustomFields: string[]
      allCustomFields: string[]
    },
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useCurrentOrganization() {
  const {
    data,
    error,
    mutate: mutateCurrentOrg,
    isValidating: isValidatingOrg,
  } = useSWR('/v1/organization', {
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const org: IOrganization = data && (data as IOrganization)
  return {
    org,
    isOrgLoading: !error && !org,
    isOrgError: error,
    mutateCurrentOrg: mutateCurrentOrg as KeyedMutator<IOrganization>,
    isValidatingOrg,
  }
}

export function useCurrentSubscriberCount(
  changelogId?: string,
  wihtoutId?: boolean,
  locales?: string[]
) {
  const {
    data,
    error,
    mutate: mutateCurrentSubscriberCount,
    isValidating,
  } = useSWR(
    changelogId
      ? ['/v1/changelog/subscriberCount', { changelogId, locales }]
      : wihtoutId
      ? '/v1/changelog/subscriberCount'
      : null
  )
  return {
    subscriberCount: (data?.result?.totalCount as number) || 0,
    result: data?.result,
    isLoading: (!error && !data) || isValidating,
    isError: error,
    mutateCurrentSubscriberCount,
  }
}

export function useIsSubscribed(fetch?: boolean) {
  const {
    data,
    error,
    mutate: mutateIsSubscribed,
  } = useSWR(fetch ? '/v1/changelog/isSubscribed' : null)
  return {
    subscribed: (data?.subscribed as boolean) || false,
    rawData: data,
    isLoading: !error && !data,
    isError: error,
    mutateIsSubscribed,
  }
}

interface ILinerStatus {
  id: string
  name: string
  color: string
  type: string
  teamId: string
  teamName: string
}
export function useLinearStatuses() {
  const {
    data,
    error,
    mutate: mutateLinearStatuses,
  } = useSWRImmutable('/v1/organization/linear/statuses')
  return {
    linearStatuses: data as ILinerStatus[],
    isLoading: !error && !data,
    isError: error,
    mutateLinearStatuses,
  }
}
export function useSubmissionsSinceLastRelease() {
  const {
    data,
    error,
    mutate: mutateReleaseSubmissions,
  } = useSWRImmutable('/v1/changelog/submissionsSinceLastRelease')
  return {
    submissions: data?.submissions as ISubmission[],
    isLoading: !error && !data,
    isError: error,
    mutateReleaseSubmissions,
  }
}

export interface IClickupStatus {
  id: string
  status: string
  type: string
  orderindex: number
  color: string
  spaceName: string
  spaceId: string
}
export function useClickupStatuses() {
  const {
    data,
    error,
    mutate: mutateClickupStatuses,
  } = useSWRImmutable('/v1/organization/clickup/statuses')
  return {
    clickupStatuses: data as IClickupStatus[],
    isLoading: !error && !data,
    isError: error,
    mutateClickupStatuses,
  }
}

interface IJiraStatus {
  id: string
  untranslatedName: string
  projectId: string
}
export function useJiraStatuses() {
  const { data, error, mutate: mutateJiraStatuses } = useSWR('/v1/organization/jira/statuses')
  return {
    jiraStatuses: data as IJiraStatus[],
    isLoading: !error && !data,
    isError: error,
    mutateJiraStatuses,
  }
}

// export function useAihelp() {
//   const { data, error, mutate } = useSWR('/v1/organization/aihelp?limit=50')

//   return {
//     result: data as IChatResult,
//     isLoading: !error && !data,
//     isError: error,
//     mutate,
//   }
// }

export interface IJiraProject {
  id: string
  name: string
  key: string
  issueTypes: {
    id: string
    name: string
  }[]
}
export function useJiraProjects() {
  const { data, error, mutate: mutateJiraProjects } = useSWR('/v1/organization/jira/projects')
  return {
    jiraProjects: data as IJiraProject[],
    isLoading: !error && !data,
    isError: error,
    mutateJiraProjects,
  }
}

export function useJiraApiKey() {
  const { data, error, mutate: mutateJiraApiKey } = useSWR('/v1/organization/jira/apiKey')
  return {
    jiraApiKey: data?.apiKey as string,
    isLoading: !error && !data,
    isError: error,
    mutateJiraApiKey,
  }
}
export function useJiraConfig() {
  const { data, error, mutate: mutateJiraConfig } = useSWR('/v1/organization/jira')
  return {
    jiraConfig: data?.config as {
      projectId: string
      issueTypeId: string
    },
    isLoading: !error && !data,
    isError: error,
    mutateJiraConfig,
  }
}

export interface DevOpsConfig {
  accountName: string
  projects: DevOpsProject[]
  syncRules: { [projectId: string]: IDevopsSyncRule[] }
  pushPreferences: { projectName: string; workItemType: string; priority: string }
  errors?: {
    type: 'webhook_registration_failed'
    projectName: string
    projectId: string
    error: string
  }[]
}

export interface DevOpsProject {
  id: string
  name: string
  process: DevOpsProcess
  states: DevOpsState[]
  workItemTypes: DevOpsWorkItemType[]
  // syncRules: IDevopsSyncRule[]
}

export interface IDevopsSyncRule {
  projectId: string
  scope: 'any' | 'all' | ''
  direction: 'devops' | 'featurebase'
  devopsStateName: string
  workItemTypeName: string
  fbStatusId: string
  notifyVoters: boolean
}

export interface DevOpsProcess {
  typeId: string
  name: string
  referenceName: string
}

export interface DevOpsState {
  id: string
  name: string
  stateCategory: 'Proposed' | 'InProgress' | 'Completed' | 'Removed'
  customizationType: number
  displayName: string
  color: string
  order: number
  workItemType: DevOpsWorkItemType
}

export interface DevOpsWorkItemTypeWithStates {
  workItemType: DevOpsWorkItemType
  states: DevOpsState[]
}

export interface DevOpsWorkItemType {
  referenceName: string
  name: string
}

export function useDevOpsConfig() {
  const { data, error, mutate: mutateDevOpsConfig } = useSWR('/v1/devops/config')
  return {
    devOpsConfig: data as DevOpsConfig,
    mutateDevOpsConfig,
    isLoading: !error && !data,
  }
}

export function useGithubConfig() {
  const { data, error, mutate: mutateGithubConfig } = useSWR('/v1/organization/github/config')
  return {
    githubConfig: data?.config as {
      repositories: {
        id: string
        name: string
        full_name: string
      }[]
      defaultRepoId?: string
      previouslySelectedRepoId?: string
      installationId: string
      syncRules: IGithubSyncRule[]
      automaticPushRules: IGithubAutomaticPushRules
    },
    isLoading: !error && !data,
    isError: error,
    mutateGithubConfig,
  }
}

export interface IJiraSyncRule {
  jiraStatusId?: string
  fbStatus?: string
  notifyVoters?: boolean
  direction?: 'jiraToFeaturebase' | 'featurebaseToJira' | 'both'
}
export const useJiraSyncRules = () => {
  const {
    data,
    error,
    mutate: mutateJiraSyncRules,
  } = useSWRImmutable(`/v1/organization/jira/syncrules`)
  return {
    jiraSyncRules: data as IJiraSyncRule[],
    isLoading: !error && !data,
    isError: error,
    mutateJiraSyncRules,
  }
}

export function useCurrentChurnToken() {
  const { data, error } = useSWR('/v1/organization/churnkey')
  const churnData: IOrganizationChurnData = data && (data as IOrganizationChurnData)
  return {
    churnData,
    isDataLoading: !error && !churnData,
    isError: error,
  }
}

export function useFilters(isMember: boolean) {
  const { data, error, mutate } = useSWR(isMember ? '/v1/organization/filters' : null)
  const filterData: ISubmissionSavedFilter[] = data?.filters || []
  return {
    filterData,
    isDataLoading: !error && !filterData,
    mutate,
    rawData: data,
    isError: error,
  }
}

// export function useNotifications() {
//   const { data, error, mutate: mutateNotifications } = useSWR('/v1/user/notification')
//   return {
//     notifications: data?.notifications,
//     rawNotificationData: data,
//     isLoading: !error && !data,
//     isError: error,
//     mutateNotifications,
//   }
// }

export const surveyResultsGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: any = {},
  id: string,
  pageId?: string
) => {
  // Adjusted to include `id` parameter for fetching survey responses
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // Modified URL to include `id` query parameter
  return [
    `/v1/organization/advancedSurvey/responses?id=${id}${pageId ? `&pageId=${pageId}` : ''}`,
    { ...filters, page: pageIndex + 1 },
  ]
}

export function useSurveyResults(
  filters: object | null,
  org: IOrganization,
  id: string, // Added `id` parameter to be used in the surveyGetKey function
  fetchOnce?: boolean,
  pageId?: string
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateSurveys,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      org ? surveyResultsGetKey(pageIndex, previousPageData, filters, id, pageId) : null, // Now passes `id`
    defaultFetcher, // Ensure 'defaultFetcher' is defined to handle the fetching logic
    {
      ...(fetchOnce
        ? {
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
          }
        : {}),
      initialSize: 1,
    }
  )

  let surveyResults: ISurveyStatisticsResponse[] = [] // Assuming this is the desired type

  if (data && !error) {
    data.forEach((page) => {
      // Assuming `page.results` contains `ISurveyStatisticsResponse` objects
      surveyResults = surveyResults.concat(page.results || [])
    })
  }

  return {
    surveyResults,
    rawSurveyResults: data,
    size,
    setSize,
    totalSurveyResults: data?.[0]?.totalResults,
    mutateSurveys,
    surveyLoading: !error && !data,
  }
}

export const surveyGetKey = (pageIndex: number, previousPageData: any, filters: any = {}) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  return [`/v1/organization/advancedSurvey`, { ...filters, page: pageIndex + 1 }]
}

export function useSurveysWithFiltering(
  filters: object | null,
  org: IOrganization,
  fetchOnce?: boolean
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateSurveys,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      org ? surveyGetKey(pageIndex, previousPageData, filters) : null,
    defaultFetcher, // Ensure you have a 'defaultFetcher' defined that handles the fetching logic
    {
      ...(fetchOnce
        ? {
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
          }
        : {}),
      initialSize: 1,
    }
  )

  let surveyResults: IAdvancedSurvey[] = []

  if (data && !error) {
    data.forEach((page) => {
      surveyResults = surveyResults.concat(page.results || [])
    })
  }

  return {
    surveyResults,
    rawSurveyResults: data,
    size,
    setSize,
    totalSurveyResults: data?.[0]?.totalResults,
    mutateSurveys,
    surveyLoading: !error && !data,
  }
}

export const notificationGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: any = { type: 'all' }
) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // const queryParams = encodeURI(queryString.stringify())
  return [`/v1/user/notification`, { ...filters, page: pageIndex + 1 }]
}

export function useNotificationsWithFiltering(
  filters: {
    type?: string[]
    viewed?: boolean
  } | null,
  org: IOrganization,
  fetchOnce?: boolean
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateNotifications,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      filters ? org && notificationGetKey(pageIndex, previousPageData, filters) : null,
    defaultFetcher,
    fetchOnce
      ? {
          revalidateOnFocus: false,
          revalidateOnMount: false,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: false,
          refreshInterval: 0,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          initialSize: 1,
        }
      : {
          initialSize: 1,
        }
  )

  let notificationResults: INotification[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as INotificationPaginate[]) {
      for (let cl of (page as INotificationPaginate).results) {
        notificationResults.push(cl)
      }
    }
  }

  return {
    notificationResults: data && notificationResults,
    rawNotificationResults: data,
    size,
    setSize,
    totalNotificationResults: data && data[0].totalResults,
    totalUnviewedResults: data && data[0].totalUnviewedResults,
    mutateNotifications,
    notificationLoading: !error && !data,

    // notificationLoading: !error && size > (data ? data?.length : 0),
  }
}

export interface ILeaderboardEntry {
  user: {
    _id: string
    type: 'admin' | 'customer'
    name: string
    picture: string
  }
  upvotesReceived: number
  commentsLeft: number
  ideasSubmitted: number
  score: number
}

export function useLeaderBoard() {
  const { data, error, mutate: mutateLeaderboard } = useSWR('/v1/organization/leaderboard')
  return {
    leaderboard: data?.leaderboard as ILeaderboardEntry[],
    rawNotificationData: data,
    isLoading: !error && !data,
    isError: error,
    mutateLeaderboard,
  }
}

interface ILinearTeam {
  id: string
  name: string
}
interface ILinearUser {
  id: string
  name: string
}
interface ILinearTeamsAndUsers {
  teams: ILinearTeam[]
  users: ILinearUser[]
  defaultTeamId: string
  onLinearDelete: 'delete' | 'keep'
}
export const useLinearTeamsAndUsers = () => {
  const { data, error, mutate: mutateLinearTeamsAndUsers } = useSWR(`/v1/organization/linear`)
  return {
    linearTeamsAndUsers: data as ILinearTeamsAndUsers,
    isLoading: !error && !data,
    isError: error,
    mutateLinearTeamsAndUsers,
  }
}

interface ClickUpList {
  id: string
  name: string
  orderindex: number
  content: string
  status?: any
  priority?: any
  assignee?: any
  task_count: number
  due_date?: any
  start_date?: any
  folder: ClickupFolder
  space: Space
  archived: boolean
  override_statuses: boolean
  permission_level: string
}

interface ClickupFolder {
  id: string
  name: string
  hidden: boolean
  access: boolean
}

interface Space {
  id: string
  name: string
  access: boolean
}

interface ClickupFolder {
  id: string
  name: string
  orderindex: number
  override_statuses: boolean
  hidden: boolean
  space: Space
  task_count: string
  archived: boolean
  statuses: Status[]
  lists: List[]
  permission_level: string
}

interface Space {
  id: string
  name: string
}

interface Status {
  id: string
  status: string
  type: string
  orderindex: number
  color: string
}

interface List {
  id: string
  name: string
  orderindex: number
  status?: any
  priority?: any
  assignee?: any
  task_count: number
  due_date?: any
  start_date?: any
  space: SpaceWithAccess
  archived: boolean
  override_statuses: boolean
  statuses: Status[]
  permission_level: string
}

interface SpaceWithAccess extends Space {
  access: boolean
}

interface IClickupInformation {
  teams: { id: string; name: string }[]
  folderlessLists: ClickUpList[]
  folders: ClickupFolder[]
  clickupPreviousTeamId: string
  clickupPreviousFolderId: string
  clickupPreviousListId: string
  onClickupDelete: 'delete' | 'keep'
}
export const useClickupInformation = () => {
  const { data, error, mutate: mutateClickupTeams } = useSWR(`/v1/organization/clickup`)
  return {
    clickupInformation: data as IClickupInformation,
    isLoading: !error && !data,
    isError: error,
    mutateClickupTeams,
  }
}

export const useLinearSyncRules = () => {
  const {
    data,
    error,
    mutate: mutateLinearSyncRules,
  } = useSWRImmutable(`/v1/organization/linear/syncrules`)
  return {
    linearSyncRules: data as ILinearSyncRule[],
    isLoading: !error && !data,
    isError: error,
    mutateLinearSyncRules,
  }
}

export const useClickupSyncRules = () => {
  const {
    data,
    error,
    mutate: mutateClickupSyncRules,
  } = useSWRImmutable(`/v1/organization/clickup/syncrules`)
  return {
    clickupSyncRules: data as IClickupSyncRule[],
    isLoading: !error && !data,
    isError: error,
    mutateClickupSyncRules,
  }
}

export const useClickupAutomaticPushRules = () => {
  const {
    data,
    error,
    mutate: mutateClickupAutomaticPushRules,
  } = useSWRImmutable(`/v1/organization/clickup/automaticpushrules`)
  const automaticPushRules = data?.automaticPushRules
  return {
    clickupAutomaticPushRules: automaticPushRules as IClickupAutomaticPushRules,
    isLoading: !error && !data,
    isError: error,
    mutateClickupAutomaticPushRules,
  }
}

export const useSlackChannels = () => {
  const { data, error, mutate: mutateSlackChannels } = useSWR(`/v1/slack/channels`)
  return {
    slackChannels: data as {
      channels: { id: string; name: string }[]
      defaultChannel: string
    },
    isLoading: !error && !data,
    isError: error,
    mutateSlackChannels,
  }
}

const disableCache = (useSWRNext: any) => {
  return (key: any, fetcher: any, config: any) => {
    const swr = useSWRNext(key, fetcher, config)
    const { data, isValidating } = swr
    return Object.assign({}, swr, {
      data: isValidating ? undefined : data,
    })
  }
}

export function useMembers(isMember: boolean) {
  const { data, error, mutate: mutateMembers } = useSWR(isMember ? '/v1/organization/admin' : null)
  const members: IMember[] = data && (data as IMember[])
  return {
    members,
    mutateMembers,
    loading: !error && !members,
  }
}

export function useSegmentKey() {
  const { data, error, mutate: mutateSegmentKey } = useSWR('/v1/organization/segmentWriteKey')
  const segmentData: { segmentWriteKey: string; success: boolean } =
    data && (data as { segmentWriteKey: string; success: boolean })
  return {
    segmentData,
    mutateSegmentKey,
  }
}

export type IntegrationName =
  | 'Linear'
  | 'Slack'
  | 'Jira'
  | 'Intercom'
  | 'Segment'
  | 'Discord'
  | 'ClickUp'
  | 'DevOps'
export function useEnabledIntegrations() {
  const {
    data,
    error,
    mutate: mutateEnabledIntegrations,
  } = useSWR('/v1/organization/enabledIntegrations')
  const enabledIntegrations: IntegrationName[] | undefined =
    data && (data?.integrations as IntegrationName[])
  const enabledIntegrationCount = enabledIntegrations?.length || 0
  return {
    enabledIntegrations,
    enabledIntegrationCount,
    mutateEnabledIntegrations,
  }
}

export const changelogGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: any = { sortBy: 'date:desc', changelogCategories: [] }
) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // const queryParams = encodeURI(queryString.stringify())
  return [`/v1/changelog`, { ...filters, page: pageIndex + 1 }]
}

export function usePendingAdmins() {
  const { data, error, mutate: mutateInvites } = useSWR('/v1/organization/invites')
  const invites: { email: string; role: string }[] =
    data?.pendingAdmins && (data?.pendingAdmins as string[])
  return {
    invites: invites,
    mutateInvites,
  }
}

export interface IBannedUserFilters {
  q?: string
  sortBy?: string
  limit?: number
  page?: number
}

const bannedUserGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: IBannedUserFilters = {}
) => {
  return [`/v1/user/bans`, { ...filters, page: pageIndex + 1 }]
}

export interface IBannedUser {
  _id: string
  organizationId: string
  type: 'email' | 'userId' | 'ip'
  value: string
  reason?: string
  expiresAt?: Date
  createdBy: string
  isActive: boolean
}

interface IBannedUserPaginate {
  results: IBannedUser[]
  totalResults: number
}

export function useBannedUsersWithFiltering(
  filters: IBannedUserFilters,
  org: IOrganization,
  fetchOnce?: boolean
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateBannedUsers,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => org && bannedUserGetKey(pageIndex, previousPageData, filters),
    defaultFetcher,
    fetchOnce
      ? {
          revalidateOnFocus: false,
          revalidateOnMount: false,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: false,
          refreshInterval: 0,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          initialSize: 1,
        }
      : {
          initialSize: 1,
        }
  )

  let bannedUsers: IBannedUser[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as IBannedUserPaginate[]) {
      for (let user of (page as IBannedUserPaginate).results) {
        bannedUsers.push(user)
      }
    }
  }

  return {
    bannedUsers: data && bannedUsers,
    size,
    setSize,
    totalBannedUsers: data && data[0].totalResults,
    rawBannedUsers: data,
    mutateBannedUsers,
  }
}

export function useChangelogsWithFiltering(
  filters: IChangelogFilters,
  org: IOrganization,
  fetchOnce?: boolean
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateChangelogs,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => org && changelogGetKey(pageIndex, previousPageData, filters),
    defaultFetcher,
    fetchOnce
      ? {
          revalidateOnFocus: false,
          revalidateOnMount: false,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: false,
          refreshInterval: 0,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          initialSize: 1,
        }
      : {
          initialSize: 1,
        }
  )

  let changelogResults: IChangelog[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as IChangelogPaginate[]) {
      for (let cl of (page as IChangelogPaginate).results) {
        changelogResults.push(cl)
      }
    }
  }
  return {
    changelogResults: data && changelogResults,
    size,
    setSize,
    totalChangelogResults: data && data[0].totalResults,
    rawChangelogResults: data,
    mutateChangelogs,
    changelogLoading: !error && size > (data ? data?.length : 0),
  }
}
