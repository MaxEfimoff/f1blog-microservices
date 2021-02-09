import React from 'react';
import { Link } from 'react-router-dom';

export default function News() {
  return (
    <div>
      <div>All blogs</div>
      <Link to="/main/news">Check out news</Link>
    </div>
  );
}
