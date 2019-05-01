import React, { Component } from 'react'

// Style
import style from './style.module.scss'

class ButtonLink extends Component {
  render() {
    return (
      <div className={style.button}>
        <span>{this.props.label}</span>
      </div>
    )
  }
}

export default ButtonLink
