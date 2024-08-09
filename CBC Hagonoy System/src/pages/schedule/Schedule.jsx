import React from 'react'
import './Schedule.css'

function Schedule() {
  return (
    <div className='main-container'>
        <div className='table-container'>
            <h4 className='title-header'>Sunday Service</h4>
            <table>
                <tr>
                    <th>TIME</th>
                    <th>SESSIONS</th>
                    <th>SPEAKERS</th>
                </tr>
                <tr>
                    <td>9:00am</td>
                    <td>Morning Prayer Service</td>
                    <td>Name of Speaker</td>
                </tr>
                <tr>
                    <td>10:00am</td>
                    <td>Session or Seminar Title</td>
                    <td>Name of Speaker</td>
                </tr>
                <tr>
                    <td>4:00pm</td>
                    <td>Session or Seminar Title</td>
                    <td>Name of Speaker</td>
                </tr>
                <tr>
                    <td>6:00pm</td>
                    <td>Session or Seminar Title</td>
                    <td>Name of Speaker</td>
                </tr>
            </table>
        </div>
    </div>
  )
}

export default Schedule