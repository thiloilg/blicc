import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';

export default function NotFoundWarning() {
  const { pages } = useContext(AppContext);
  return (
    <div className="col-md-5 mx-auto py-5 my-5 text-center">
      <h1 className="display-4 font-weight-normal">{pages.notFound.title}</h1>
    </div>
  );
}
