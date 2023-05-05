import React from 'react'

const LoadingFragment = () => {
    return (
        <div className="col-lg-12 mt-4 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Please wait while we fetch some stuff...</h5>
        </div>
    )
}

export default LoadingFragment