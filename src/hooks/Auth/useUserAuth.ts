import { useCallback, useContext, useEffect, useState } from 'react'
import { SERVER_ERROR, WRONG_CREDENTIALS } from '../../constants'
import { AuthContext } from '../../context/Auth/AuthContext'
import { AuthContextInterface } from '../../context/Auth/AuthContext.interface'
import { AuthContextState } from '../../context/Auth/AuthContextState'
import { Credential } from '../../types/credentials/Credential'
import { Change, Submit } from '../../types/Events'
import { ChangeHandler, SubmitHandler } from '../../types/Handlers'
import { useFetch } from '../useFetch'

interface UserAuth<T> {
    state: State<T>
    methods: Methods
}

interface State<T> {
    authState: AuthContextState | null
    credentials: T
    canSubmit: boolean
    credentialsErrors: string[]
}

interface Methods {
    signIn: SubmitHandler
    signUp: SubmitHandler
    changeHandler: ChangeHandler<HTMLInputElement>
}

export const useUserAuth = <T>(initialCredentials: Credential[]): UserAuth<T> => {
    const { authState, setAuthState } = useContext<AuthContextInterface>(AuthContext)

    const { fetchData, state } = useFetch<AuthContextState>()
    const { data, error, loading } = state

    const [credentials, setCredentials] = useState<Credential[]>(initialCredentials)

    const [credentialsErrors, setCredentialsErrors] = useState<string[]>([])

    const [canSubmit, setCanSubmit] = useState<boolean>(false)

    const changeHandler = useCallback((event: Change<HTMLInputElement>) => {
        setCredentials((currentValues: Credential[]) =>
            currentValues.map((credential: Credential) => {
                if (event.target.name === credential.name) {
                    return { name: credential.name, value: event.target.value }
                }
                return credential
            })
        )
    }, [])

    const signIn = useCallback(
        (event: Submit) => {
            event.preventDefault()

            const errors: string[] = validateCredentials(credentials)
            if (errors?.length) {
                setCredentialsErrors(errors)
                return
            }

            fetchData(`${process.env.REACT_APP_API_URL}/auth/sign-in`, {
                method: 'POST',
                body: JSON.stringify(
                    credentials.reduce((acc: any, credential: Credential) => {
                        return { ...acc, [credential.name]: credential.value }
                    }, {})
                )
            })
        },
        [fetchData, credentials]
    )

    const signUp = useCallback(
        (event: Submit) => {
            event.preventDefault()

            const errors: string[] = validateCredentials(credentials)
            if (errors?.length) {
                setCredentialsErrors(errors)
                return
            }

            fetchData(`${process.env.REACT_APP_API_URL}/auth/sign-in`, {
                method: 'POST',
                body: JSON.stringify(
                    credentials.map(credential => ({ [credential.name]: credential.value }))
                )
            })
        },
        [fetchData, credentials]
    )

    useEffect(() => {
        if (credentials.find((credential: Credential) => credential.value.trim() === '')) {
            setCanSubmit(false)
            return
        }
        if (loading) {
            setCanSubmit(false)
            return
        }

        setCanSubmit(true)
    }, [credentials, loading])

    useEffect(() => {
        setCredentialsErrors([])
    }, [credentials])

    useEffect(() => {
        if (error && error?.statusCode < 500) {
            setCredentialsErrors((errors: string[]) => [...errors, WRONG_CREDENTIALS])
        }
        if (error && error?.statusCode >= 500) {
            setCredentialsErrors((errors: string[]) => [...errors, SERVER_ERROR])
        }
    }, [error])

    useEffect(() => {
        setAuthState(data)
    }, [data, setAuthState])

    return {
        state: {
            authState,
            credentials: credentials.reduce((acc: any, credential: Credential) => {
                return { ...acc, [credential.name]: credential.value }
            }, {}),
            canSubmit,
            credentialsErrors
        },
        methods: {
            signIn,
            signUp,
            changeHandler
        }
    }
}

const validateCredentials = (credentials: Credential[]): string[] => {
    const errors: string[] = []

    const email: Credential | undefined = credentials.find(
        (credential: Credential) => credential.name === 'email'
    )

    if (!email!.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        errors.push('email')
    }

    const password: Credential | undefined = credentials.find(
        (credential: Credential) => credential.name === 'password'
    )

    if (!password!.value.match(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)) {
        errors.push('password')
    }

    const confirmPassword: Credential | undefined = credentials.find(
        (credential: Credential) => credential.name === 'confirm-password'
    )

    if (confirmPassword && confirmPassword !== password) {
        errors.push('confirm-password')
    }

    return errors
}