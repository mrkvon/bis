import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { readEventParticipants } from '../../features/event/eventAPI'
import { NullableEventProps, Participant } from '../../features/event/types'
import { logout, setToken } from '../../features/login/loginSlice'
import { Credentials, Role } from '../../features/login/types'
import { readPerson, searchPeople } from '../../features/person/personAPI'
import { Person } from '../../features/person/types'
import {
  props2camelCaseRecursive,
  props2snakeCaseRecursive,
} from '../../helpers'
import { RootState } from '../store'
import {
  AdministrativeUnitResponse,
  CreateEventRequest,
  EventResponse,
  Paginated,
  UpdateEventRequest,
  WhoAmIResponse,
} from './bronto-types'
import { programs } from '../../features/event/types'

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://brontosaurus.klub-pratel.cz/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).login.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (typeof args === 'object' && 'body' in args) {
    args.body = props2snakeCaseRecursive(args.body)
  }
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 403) {
    // try to get a new token
    const refresh = globalThis.localStorage.getItem('refreshToken')
    if (refresh) {
      const refreshResult = await baseQuery(
        {
          method: 'POST',
          url: 'token/refresh/',
          body: {
            refresh,
          },
        },
        api,
        extraOptions,
      )
      if (refreshResult.data) {
        // store the new token
        api.dispatch(
          setToken((refreshResult.data as { access: string }).access),
        )
        // retry the initial query
        result = await baseQuery(args, api, extraOptions)
      } else {
        api.dispatch(logout())
      }
    } else {
      api.dispatch(logout())
    }
  }

  if (typeof result === 'object' && 'data' in result) {
    result.data = props2camelCaseRecursive(result.data)
  }

  return result
}

export const brontoApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['LoggedUser', 'Event', 'Person', 'AdministrativeUnit'],
  endpoints: builder => ({
    login: builder.mutation<{ access: string; refresh: string }, Credentials>({
      query: credentials => ({
        url: 'token/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['LoggedUser'],
      onQueryStarted: async (a, { queryFulfilled, dispatch }) => {
        const {
          data: { access, refresh },
        } = await queryFulfilled

        globalThis.localStorage.setItem('refreshToken', refresh)
        dispatch(setToken(access))
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['LoggedUser'],
      onQueryStarted: async (a, { queryFulfilled }) => {
        await queryFulfilled
        globalThis.localStorage.clear()
      },
    }),
    getCurrentUser: builder.query<
      {
        id: number
        givenName: string
        familyName: string
        nickname: string
        roles: Role[]
      },
      void
    >({
      query: () => 'frontend/whoami/',
      providesTags: ['LoggedUser'],
      transformResponse: ({
        id,
        isEventOrganizer,
        firstName,
        lastName,
        nickname,
      }: WhoAmIResponse) => {
        const roles: Role[] = ['mem']
        if (isEventOrganizer) roles.unshift('org')
        return {
          id,
          givenName: firstName,
          familyName: lastName,
          nickname,
          roles,
        }
      },
    }),
    getOrganizedEvents: builder.query<Paginated<NullableEventProps>, void>({
      query: () => 'frontend/organized_events/',
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Event' as const,
                id,
              })),
              { type: 'Event', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Event', id: 'PARTIAL-LIST' }],
      transformResponse: ({ results, ...rest }: Paginated<EventResponse>) => ({
        ...rest,
        results: results.map(result => transformEventResponse(result)),
      }),
    }),
    getOrganizedEvent: builder.query<NullableEventProps, number>({
      query: eventId => `frontend/organized_events/${eventId}/`,
      providesTags: (result, error, eventId) => [
        { type: 'Event', id: eventId },
      ],
      transformResponse: (result: EventResponse) =>
        transformEventResponse(result),
    }),
    createEvent: builder.mutation<EventResponse, CreateEventRequest>({
      query: body => ({
        url: 'frontend/events/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event', id: 'PARTIAL-LIST' }],
    }),
    updateEvent: builder.mutation<EventResponse, UpdateEventRequest>({
      query: ({ id, ...body }) => ({
        url: `frontend/organized_events/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, request) => [
        {
          type: 'Event',
          id: request.id,
        },
      ],
    }),
    getPerson: builder.query<Person, number>({
      queryFn: async personId => ({
        data: await readPerson(personId),
      }),
      providesTags: (result, error, id) => [{ type: 'Person', id }],
    }),
    getPersons: builder.query<Person[], number[]>({
      queryFn: async ids => ({
        data: await Promise.all(ids.map(async id => await readPerson(id))),
      }),
      providesTags: result =>
        (result ?? []).map(({ id }) => ({ type: 'Person', id })),
    }),
    getEventParticipants: builder.query<Array<Participant & Person>, number>({
      queryFn: async eventId => ({
        data: await readEventParticipants(eventId),
      }),
    }),
    searchPeople: builder.query<Person[], string>({
      queryFn: async query => ({
        data: await searchPeople(query),
      }),
      providesTags: (result, error, query) =>
        (result ?? ([] as Person[]))
          .map(person => ({ type: 'Person' as const, id: String(person.id) }))
          .concat([{ type: 'Person', id: query }]),
    }),
    getAdministrativeUnits: builder.query<AdministrativeUnitResponse[], void>({
      query: () => 'bronto/administrative_unit',
      providesTags: ['AdministrativeUnit'],
    }),
  }),
})

export const {
  useGetOrganizedEventsQuery,
  useGetOrganizedEventQuery,
  useGetEventParticipantsQuery,
  useGetCurrentUserQuery,
  useGetPersonQuery,
  useGetPersonsQuery,
  useSearchPeopleQuery,
  useLoginMutation,
  useLogoutMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
} = brontoApi

const transformEventResponse = ({
  indendedFor,
  administrativeUnits,
  additionalPhoto1,
  additionalPhoto2,
  additionalPhoto3,
  additionalPhoto4,
  additionalPhoto5,
  additionalPhoto6,
  eventType,
  program,
  ...result
}: EventResponse): NullableEventProps => ({
  ...result,
  eventType: eventType?.slug ?? null,
  startTime: null,
  repetitions: null,
  intendedFor: indendedFor,
  administrativeUnit: administrativeUnits?.[0] ?? null,
  newcomerText1: null,
  newcomerText2: null,
  newcomerText3: null,
  locationInfo: null,
  targetMembers: null,
  advertiseInRoverskyKmen: null,
  advertiseInBrontoWeb: null,
  workingDays: null,
  note: null,
  mainOrganizer: null,
  team: [],
  registrationMethodEmail: null,
  additionalPhotos: [
    additionalPhoto1,
    additionalPhoto2,
    additionalPhoto3,
    additionalPhoto4,
    additionalPhoto5,
    additionalPhoto6,
  ] as string[],
  photos: [],
  feedbackLink: null,
  participantListScan: null,
  documentsScan: null,
  bankAccount: null,
  hoursWorked: null,
  commentOnWorkDone: null,
  totalParticipants: null,
  totalParticipantsUnder26: null,
  participantList: [],
  program: program && (program.trim() as keyof typeof programs),
})
