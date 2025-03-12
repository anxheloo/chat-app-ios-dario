import React from 'react';
import CallList from './CallList';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

const Calls = () => {
  return (
    <>
      <CallList />
      <FullScreenLoader version={'absolute'} type="callsPagination" />
    </>
  );
};

export default Calls;
