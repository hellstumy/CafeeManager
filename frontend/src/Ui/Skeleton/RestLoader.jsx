import React from 'react'
import ContentLoader from 'react-content-loader'

const RestLoader = (props) => (
  <ContentLoader
    speed={2}
    width={313}
    height={426}
    viewBox="0 0 313 426"
    backgroundColor="#1e293b"
    foregroundColor="#e5e0e0"
    {...props}
  >
    <rect x="0" y="0" rx="12" ry="12" width="313" height="426" />
  </ContentLoader>
)

export default RestLoader
