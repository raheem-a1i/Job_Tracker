import React from "react";

const StatusCounts = ({ selectedStatus, setSelectedStatus }) => {
  return (
    <div className="status-counts">
      <label htmlFor="status-filter" className="me-2">Filter by status:</label>
      <select
        id="status-filter"
        className="form-select"
        style={{ display: 'inline-block', width: 'auto' }}
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Rejected">Rejected</option>
        <option value="Interviewed">Interviewed</option>
        <option value="Offer">Offer</option>
      </select>
    </div>
  );
};

export default StatusCounts;
