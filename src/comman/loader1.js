import React from 'react';
import ReactLoading from 'react-loading';
 
const Example1 = ({ type, color }) => (
    <ReactLoading type={"spinningBubbles"} color={"#007bff"} height={30} width={30} className="loader" />
);
 
export default Example1;