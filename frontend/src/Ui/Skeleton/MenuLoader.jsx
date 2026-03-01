import React from 'react'
import ContentLoader from 'react-content-loader'

const MenuLoader = (props) => (
  <ContentLoader
    speed={2}
    width={398}
    height={360}
    viewBox="0 0 398 360"
    backgroundColor="#1e293b"
    foregroundColor="#334155"
    {...props}
  >
    <rect x="0" y="0" rx="12" ry="12" width="398" height="220" />
    <rect x="16" y="240" rx="8" ry="8" width="180" height="18" />
    <rect x="16" y="270" rx="6" ry="6" width="260" height="12" />
    <rect x="16" y="290" rx="6" ry="6" width="220" height="12" />
    <rect x="16" y="318" rx="8" ry="8" width="90" height="28" />
    <rect x="306" y="318" rx="8" ry="8" width="76" height="28" />
  </ContentLoader>
)

export default MenuLoader
