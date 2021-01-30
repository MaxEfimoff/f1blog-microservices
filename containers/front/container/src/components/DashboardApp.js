import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';

export default () => {
  const dashboardRef = useRef(null);

  useEffect(() => {
    mount(document.querySelector('#dashboard'));
  }, []);

  return <div id="dashboard" ref={dashboardRef} />;
};
