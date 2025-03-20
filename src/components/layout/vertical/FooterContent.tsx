'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Designed & Developed by `}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='#' target='_blank' className='text-primary capitalize'>
          Brilliant Esystems
        </Link>
      </p>
    </div>
  )
}

export default FooterContent
