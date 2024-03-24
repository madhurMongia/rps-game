import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { wagmiConfig } from '@/blockchain/config.ts'
import Web3ModalProvider from '@/contexts/Web3Modal'

export const metadata: Metadata = {
  title: 'Start Battle',
  description: 'Create RPS game'
}
interface BodyStyleProps {
  backgroundColor: string;
  overflowX: 'auto' | 'hidden' | 'scroll' | 'visible' | 'initial' | 'inherit';
  margin: number;
}

const bodyStyles:BodyStyleProps = {
  backgroundColor: '#111827', 
  overflowX: 'hidden',
  margin : 0
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'))
  return (
    <html>
      <body  style={bodyStyles}>
        <Web3ModalProvider initialState={initialState}>
          {children}
          </Web3ModalProvider>
      </body>
    </html>
  )
}