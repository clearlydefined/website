import React from 'react';

const HealthCheck = () => {
  return (
    <div>
        <pre>{JSON.stringify({foo: "bar"})}</pre>
    </div>
  );
};

export default HealthCheck;
