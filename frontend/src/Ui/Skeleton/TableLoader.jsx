import React from 'react'
import ContentLoader from 'react-content-loader'

const TableLoader = (props) => (
  <ContentLoader
    speed={2}
    width={229}
    height={220}
    viewBox="0 0 229 220"
    backgroundColor="#1e293b"
    foregroundColor="#334155"
    {...props}
  >
    <rect x="0" y="0" rx="12" ry="12" width="229" height="220" />
    <rect x="16" y="16" rx="10" ry="10" width="88" height="34" />
    <rect x="16" y="76" rx="6" ry="6" width="72" height="12" />
    <rect x="16" y="98" rx="6" ry="6" width="48" height="12" />
    <rect x="16" y="132" rx="6" ry="6" width="72" height="12" />
    <rect x="16" y="170" rx="8" ry="8" width="197" height="34" />
  </ContentLoader>
)

export default TableLoader
