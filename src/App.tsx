import React, { lazy, Suspense } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Loader } from './components/UI/Loader'
import { useRefreshToken } from './hooks/Auth/useRefreshToken'

const Home: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/Home'))
const SignIn: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/SignIn'))
const SignUp: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/SignUp'))
const Product: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/Product'))
const Products: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/Products'))
const Profile: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/Profile'))
const Error: React.LazyExoticComponent<React.FC<Props>> = lazy(() => import('./pages/Error'))

interface Props {}

export const App: React.FC<Props> = () => {
    useRefreshToken()

    const { pathname } = useLocation<Location>()
    return (
        <Layout>
            <Suspense fallback={<Loader />}>
                <Switch>
                    <Route path='/' exact>
                        <Home />
                    </Route>
                    <Route path='/sign-in' exact>
                        <SignIn />
                    </Route>
                    <Route path='/sign-up' exact>
                        <SignUp />
                    </Route>
                    <Route path='/cart' exact>
                        <h3>cart</h3>
                    </Route>
                    <Route path='/profile' exact>
                        <Profile />
                    </Route>
                    <Route path='/products/:type' exact>
                        <Products key={pathname} />
                    </Route>
                    <Route path='/products/:type/:id' exact>
                        <Product />
                    </Route>
                    <Route path='/error'>
                        <Error />
                    </Route>
                </Switch>
            </Suspense>
        </Layout>
    )
}
