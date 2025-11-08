import { useState } from "react";
import UpdateJobs from "./UpdateJobs";
import StatusCounts from "./StatusCounts";
import { decodeHTMLEntities } from "./Helper";

const ListJobs = ({ refreshJobList, jobsList }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const sortJobs = jobsList
    .sort((a, b) => b.date_applied.localeCompare(a.date_applied))
    .reduce((acc, job) => {
      const date = job.date_applied;
      acc[date] = acc[date] || [];
      acc[date].push(job);
      return acc;
    }, {});

  const sortedJobsList = Object.values(sortJobs).flatMap((jobsDate) =>
    jobsDate.sort((a, b) => b.id - a.id)
  );

  const jobsToRender = selectedStatus && selectedStatus !== 'All'
    ? sortedJobsList.filter((job) => job.app_status === selectedStatus)
    : sortedJobsList;

  return (
    <div>
      <div className="sticky-count">
        <h1 className="list-header">Applications: {jobsList.length}</h1>
        <StatusCounts
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        
      </div>
      <div className="job-list">
        {jobsToRender.map((job) => (
          <div className="job" key={job.id}>
            <div className="company-name">
              {decodeHTMLEntities(job.company_name)}
            </div>
            <p className="job-role">{job.job_role}</p>
            <p className="job-salary">{job.job_salary}</p>
            {job.notes && <p className="job-notes">Notes: {job.notes}</p>}
            <span>
              Applied on:
              <br />
              {new Date(job.date_applied).toLocaleDateString()}
            </span>
            <p className="status-style">
              Status:
              <br />
              {job.app_status}
            </p>
            <div className="update-button">
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target={`#id${job.id}`}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            </div>
            <UpdateJobs
              job={job}
              refreshJobList={refreshJobList}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListJobs;
