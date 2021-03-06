"use strict"

import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl'

class Promotion extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    const promo = this.composePromo()
    const sale = promo.deduction ? Math.floor((parseInt(promo.deduction)/parseInt(course.price))*100) : null
    return (
      <div style={{display: 'inline-block'}} >
        {
          sale ? <span className="w3-text-red"> <i className="fas fa-dollar-sign" /> {' '} -{sale}% </span> : null
        }
        <br />
        {
          promo.gifts ? <span className="w3-text-green"> <i className="fas fa-gift" /> {' '} +Gifts </span> : null
        }
      </div>
    )
  }
  composePromo() {
    const course = this.props.course
    const me = this.props.me
    const rewards = me? me.rewards.filter( reward => reward.type === 'voucher' && reward.scope.indexOf(course.id) !== -1 && this.checkExpire(reward.expireIn)) : []
    const promo = { deduction: 0, gifts: false }
    this.props.promos.forEach( p => {
      if (p.type === 'sale' && this.checkExpire(p.expireIn)) { promo.deduction += parseInt(p.deduction) }
      if (p.type === 'gift' && this.checkExpire(p.expireIn)) { promo.gifts = true }
    })
    rewards.forEach( reward => promo.deduction += parseInt(reward.value) )
    return promo
  }
  checkExpire(timestamp) {
    if (!timestamp) {
      return true
    }
    const now = (new Date()).getTime()
    return (parseInt(now) < parseInt(timestamp))
  }
}

class LevelBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    const _rating = this._ratingCourseLevel(course.level)
    return (
      <div className="w3-container" >
        <div className="w3-bar-item  w3-right">
            {
              _rating.map((val, index) => {
                const _color = val ? 'w3-green' : 'w3-grey w3-opacity'
                return (<div key={index} className={_color} style={{width: '8px', height: '8px', marginLeft: '2px', display: 'inline-block'}} />)
              })
            }
            <span className='w3-small'> {course.level} </span>
        </div>
      </div>
    )
  }
  _ratingCourseLevel(level) {
    if (level === 'Beginner') {
      return [false, false, true]
    }
    if (level === 'Intermidate') {
      return [false, true, true]
    }
    if (level === 'Advanced') {
      return [true, true, true]
    }
  }
}

class Tags extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const tags = this.props.tags
    if (tags && tags.length > 0) {
      return (
        <span>
          {
            tags.map(tag => {
              const color = this.color(tag.toLowerCase())
              return (
                <label key={tag} className={`w3-tag w3-${color}`} style={{marginRight: '4px'}}> {tag.toUpperCase()} </label>
              )
            })
          }
        </span>
      )
    } else {
      return null
    }
  }
  color(tag) {
    switch (tag) {
      case 'hot':
      case 'sale':
        return 'red'
      case 'new':
        return 'yellow'
    }
  }
}

class CoursePanel extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const user = this.props.user
    const me = this.props.me
    const course = this.props.course
    const promos = this.props.promos
    const tags = course.tags
    return (
      <div className="w3-bar" style={{marginBottom: '6px'}}>
        <div className="w3-bar-item">
          <div className="w3-cell-row">
            <img src={course.thumbnail} className="w3-container w3-cell w3-hide-small" style={{width:'150px', borderRadius: '24px'}} />

            <div className="w3-cell" style={{maxWidth: '530px'}}>
              <Tags tags = {tags} />
              <div className="cursor-pointer w3-text-dark-grey" style={{fontWeight: 'bold', padding: '0 0 4px 0'}}>
                <a  href={`/course/${course.id}`}
                    className="w3-hover-text-blue"
                    style={{textDecoration: 'none'}}
                    onClick = { e => { e.preventDefault(); this.props.navigate(`course/${course.id}`)}}
                >
                  {course.title}
                </a>
              </div>
              <div className="w3-small w3-text-dark-grey" style={{fontStyle: 'italic', padding: '0 0 8px 0'}}> {course.snippet} </div>
              <div>
                <span className="w3-text-grey"> <FormattedMessage id="label.skills" />: </span>
                <br />
                {
                  course.skills.map(skill => (
                    <span key={skill} > <span className="w3-tag w3-round w3-left-align w3-green" style={{margin: '4px 0'}}> {skill} </span> {'\u00A0'} </span>
                    // <span key={skill} > <span className="w3-text-green" style={{margin: '4px 0', fontWeight: 'bold'}}> {skill} </span> {'\u00A0'} </span>
                  ))
                }
                <br />
              </div>
              <hr style={{margin: '8px 0'}} />
              <div>
                <span className="w3-text-grey"><FormattedMessage id="label.required_for_certificates" />: </span>
                <br />
                {
                  course.certs.map(cert => (
                    // <span key={cert} > <span className="w3-tag w3-teal" style={{margin: '4px 0'}}> {cert} </span> {'\u00A0'} </span>
                    <span key={cert} > <span className="w3-text-blue" style={{margin: '4px 0', fontWeight: 'bold', display: 'inline-block'}}> + {cert} </span> {'\u00A0'} </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        {/* render course action button */}
        <div className="w3-bar-item w3-hide-large" style={{width: '100%'}}>
          <div  className="w3-hide-small" style={{width: '150px', height: '10px', display: 'inline-block'}} />
          <Promotion course={course} promos={promos} user={user} me={me} />
          {' '}
          <a  href={`/course/${course.id}`}
              className="w3-button w3-round w3-blue w3-card-4 w3-right"
              onClick = { e => { e.preventDefault(); this.props.navigate(`course/${course.id}`)}}
          >
            <FormattedMessage id="button.view_course" />
          </a>
        </div>
        <div className="w3-bar-item w3-right w3-hide-medium w3-hide-small">
          <a  href={`/course/${course.id}`}
              className="w3-button w3-round w3-blue w3-card-4"
              onClick = { e => { e.preventDefault(); this.props.navigate(`course/${course.id}`)}}
          >
            <FormattedMessage id="button.view_course" />
          </a>
          <br /> <br />
          <Promotion course={course} promos={promos} user={user} me={me} />
        </div>
      </div>
    )
  }
}

export default class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hideCompletedCourses: false
    }
  }
  render() {
    const path = this.props.href && this.props.href.getPathName() || this.props.path
    if (!path.match(/\/.*$/)) { return null }
    const prog = path.match(/\/.*$/)[0].replace('/','')
    const programs = this.props.programs
    const program = programs.find(program => program.id === prog)
    if (!program) { return (<div className="w3-container w3-text-red"> 404 Page not found </div>) }
    const courses = []
    for (let i = 0; i < program.courses.length; i++) {
      const id = program.courses[i]
      const enrolled = this.props.me && this.props.me.enrolls && this.props.me.enrolls.find(c => c.courseId === id)
      if (this.props.user && this.state.hideCompletedCourses && enrolled && enrolled.status === 'completed') {
        continue
      }
      const course = this.props.courses.find(c => c.id === id)
      if (course) { courses.push(course) }
    }
    return (
      <div>
        <div className="w3-container w3-text-blue" style={{display: this.props.user? 'block' : 'none'}}>
          <input  className="w3-check"
                  type="checkbox"
                  checked={this.state.hideCompletedCourses}
                  onChange={e => this.setState({hideCompletedCourses: !this.state.hideCompletedCourses})}
                  style={{marginRight: '8px'}}
          />
          <FormattedMessage id="label.hide_completed_course" />
        </div>
        <div className="w3-cell">
          <ul className="w3-ul">
            {
              courses.map( course => {
                const promos = this.props.promos? this.props.promos.filter( promo => promo.target.indexOf(course.id) !== -1 ) : []
                return (
                  <li key = {course.id} style={{padding: '0 0 8px 0'}}>
                    <LevelBar course = {course} />
                    <CoursePanel course = {course} promos = {promos} user={this.props.user} me={this.props.me} navigate={this.props.navigate} />
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
