import React from 'react'

export interface IAlert{
    message:string,
    type:'danger'|'warning'|'info'|'success',
    clossable:boolean
}

const Alert = ({message,type='danger',clossable=true}:IAlert) => {
  return (
    <div className={`alert alert-${type} ${clossable && 'alert-dismissable fade show'}`}>{message}</div>
  )
}

export default Alert