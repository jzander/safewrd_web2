import React from 'react'

// Components
import ButtonLink from '../ButtonLink'

// Style
import imgLogo from '../../assets/images/safewrd_logo.svg'
import style from './style.module.scss'

export default function Header() {
  return (
    <div className={style.header}>
      <div className={style.logo}>
        <img src={imgLogo} alt="image-logo" />
        <span>SafeWrd</span>
      </div>
      <div className={style.links}>
        <ButtonLink label="About" />
        <ButtonLink label="Contact us" />
      </div>
    </div>
  )
}
