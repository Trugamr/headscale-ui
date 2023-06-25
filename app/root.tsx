import { cssBundleHref } from '@remix-run/css-bundle'
import type {
  LinkDescriptor,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import styles from '~/styles/app.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Headscale',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  const descriptors: LinkDescriptor[] = [
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/Poppins/Poppins-Regular.woff',
      type: 'font/woff',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/Poppins/Poppins-Medium.woff',
      type: 'font/woff',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/Poppins/Poppins-SemiBold.woff',
      type: 'font/woff',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/Poppins/Poppins-Bold.woff',
      type: 'font/woff',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: styles,
    },
  ]

  if (cssBundleHref) {
    descriptors.push({ rel: 'stylesheet', href: cssBundleHref })
  }

  return descriptors
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="text-gray-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
