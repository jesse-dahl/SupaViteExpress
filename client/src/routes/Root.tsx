import React from 'react'
import logger from '@sve/pino';

const Root = () => {
  logger.INFO('THIS IS A TEST');
  return (
    <div id='root-div' className="text-gray-900">Hi</div>
  )
}

export default Root