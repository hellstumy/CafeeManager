import React from 'react'
import ContentLoader from 'react-content-loader'

const OrderLoader = (props) => (
  <ContentLoader
    speed={2}
    width={320}
    height={170}
    viewBox="0 0 320 170"
    backgroundColor="#1e293b"
    foregroundColor="#334155"
    {...props}
  >
    <rect x="0" y="0" rx="12" ry="12" width="320" height="170" />
    <rect x="16" y="16" rx="8" ry="8" width="120" height="16" />
    <rect x="16" y="44" rx="6" ry="6" width="84" height="12" />
    <rect x="16" y="66" rx="6" ry="6" width="180" height="12" />
    <rect x="16" y="88" rx="6" ry="6" width="160" height="12" />
    <rect x="16" y="128" rx="6" ry="6" width="68" height="14" />
    <rect x="242" y="122" rx="8" ry="8" width="62" height="28" />
  </ContentLoader>
)

export default OrderLoader
