import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage, useDeliveryEndpoint } from '../../common/hooks'
import { MetaData } from '../../common/components/meta-data/MetaData'
import { ReactComponent as Logo } from '../../assets/img/Logo.svg'
import { StepByStepGuide } from './StepByStepGuide'
import { AndroidApp } from './AndroidApp'
import './LandingPage.scss'

export function LandingPage() {
  const content = useLanguage()
  const title = 'Blicc'
  const description = 'Visualize your data with customizable dashboards.'
  const path = '/'

  // close websocket connection on logged out
  useDeliveryEndpoint()

  return (
    <>
      <MetaData title={title} description={description} path={path} />
      <div className="col-md-5 mx-auto py-5 my-5 text-center">
        <Logo height="100px" alt="logo" />
        <h1 className="display-4 font-weight-normal">{content.brand}</h1>
        <p className="lead font-weight-normal">{content.brandDescription}</p>
        <Link className="btn btn-outline-primary" to="/dashboards">
          {content.getStarted}
        </Link>
      </div>
      <AndroidApp />
      <StepByStepGuide />
    </>
  )
}
