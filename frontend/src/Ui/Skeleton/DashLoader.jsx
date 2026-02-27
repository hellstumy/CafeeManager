import React from 'react'
import ContentLoader from 'react-content-loader'

const DashLoader = (props) => (
  <ContentLoader
    speed={2}
    width={322}
    height={277}
    viewBox="0 0 322 277"
    backgroundColor="#1e293b"
    foregroundColor="#e5e0e0"
    {...props}
  >
    <rect x="0" y="0" rx="12" ry="12" width="322" height="277" />
  </ContentLoader>
)

export default DashLoader
