import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, style }) => {
    return (
        <div
            className="skeleton"
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius || '4px',
                ...style
            }}
        ></div>
    );
};

export default Skeleton;
