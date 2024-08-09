import React from 'react'
import { FILLER_IMAGE } from '../../assets/Assets'
import './Qoutes.css'

function Qoutes() {
  return (
    <div className='qoutes-container'>
        <div className='qoute-box'>
            <h2 className='main-text'>HOW TO LOVE SOMEBODY GENUINELY</h2>
            <p className='verse'>”The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.“ - Lamentations‬ ‭3‬:‭22‬-‭23‬ ‭ESV‬</p>
        </div>
        <div className='img-holder'>
            <img src={FILLER_IMAGE} alt="filler-img" />
        </div>
    </div>
  )
}

export default Qoutes