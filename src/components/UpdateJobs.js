import React, { useState, useEffect } from "react";
import validator from "validator";
import { decodeHTMLEntities } from "./Helper";

const UpdateJobs = ({ job, refreshJobList }) => {

    const [jobInfo, setJobInfo] = useState({
        company_name: job.company_name,
        job_role: job.job_role,
        date_applied: job.date_applied,
        app_status: job.app_status,
        status_rejected: job.status_rejected,
        status_interviewed: job.status_interviewed,
        status_offer: job.status_offer,
        notes: job.notes || "",
        job_salary: job.job_salary
    });

    const [errorMessages, setErrorMessages] = useState({
        company_name: "",
        job_role: ""
    });

    const [isDisabled, setIsDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "company_name") {
            if (!validator.isLength(value, { min: 0, max: 50 })) {
              setErrorMessages({
                ...errorMessages,
                company_name: "Max characters allowed reached",
              });
            } else {
              setErrorMessages({
                ...errorMessages,
                company_name: "",
              });
            }
          } else if (name === "job_role") {
            if (!validator.isLength(value, { min: 0, max: 50 })) {
                setErrorMessages({
                ...errorMessages,
                job_role: "Max characters allowed reached",
              });
            } else {
                setErrorMessages({
                ...errorMessages,
                job_role: "",
              });
            }
          };

    if (name === "app_status" && value !== "Applied") {
        setJobInfo((prevJobInfo) => {
            const statusToUpdate = value === "Rejected" ? "status_rejected" :
                value === "Interviewed" ? "status_interviewed" :
                value === "Offer" ? "status_offer" : null;

            if (statusToUpdate) {
                return {
                    ...prevJobInfo,
                    app_status: value,
                    [statusToUpdate]: new Date().toISOString()
                };
            } else {
                return {
                    ...prevJobInfo,
                    app_status: value
                };
            }
        });
    } else {
        setJobInfo({ ...jobInfo, [name]: value });
    }
};

useEffect(() => {
        if (validator.isLength(jobInfo.company_name, { min: 1, max: 50 }) && validator.isLength(jobInfo.job_role, { min: 1, max: 50 })) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [jobInfo]);

        const updateJobInfo = async e => {
                e.preventDefault();
                if (isSubmitting) return;
                setIsSubmitting(true);

            try {
                                                const body = {
                                                company_name: jobInfo.company_name,
                                                job_role: jobInfo.job_role,
                                                date_applied: jobInfo.date_applied,
                                                app_status: jobInfo.app_status,
                                                // status timestamps are set when the status is changed in changeHandler
                                                status_rejected: jobInfo.status_rejected,
                                                status_interviewed: jobInfo.status_interviewed,
                                                status_offer: jobInfo.status_offer,
                                                notes: jobInfo.notes,
                                                job_salary: jobInfo.job_salary,
                                        };
                    const response = await fetch(`http://localhost:5000/job/${job.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json'},
                            body: JSON.stringify(body)
                    });
                    if (!response.ok) {
                        const text = await response.text().catch(() => 'Unknown error');
                        // eslint-disable-next-line no-alert
                        alert('Error updating job: ' + text);
                        return;
                    }
                    refreshJobList();

                    // programmatically hide modal
                    try {
                        const modalEl = document.getElementById(`id${job.id}`);
                        if (window.bootstrap && modalEl) {
                            const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
                            modalInstance.hide();
                        }
                    } catch (hideErr) {
                        // eslint-disable-next-line no-console
                        console.warn('Could not hide modal programmatically', hideErr);
                    }
            } catch (error) {
                    console.error(error);
                    // eslint-disable-next-line no-alert
                    alert('Network error: ' + (error.message || error));
            } finally {
                setIsSubmitting(false);
            }
        }

    const deleteJob = async (id) => {
        try {
            await fetch(`http://localhost:5000/job/${job.id}`, {
                method: 'DELETE'
            });
            refreshJobList();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <div className="modal fade" id={`id${job.id}`} data-bs-backdrop="static">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content rounded-3 shadow-sm">

                        <div className="modal-header border-0">
                            <h5 className="modal-title">Update Job</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => setJobInfo(job)}
                            />
                        </div>

                        <div className="modal-body">
                            <form className="container-fluid">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Company Name <span className="text-danger">*</span></label>
                                        <input
                                            onChange={changeHandler}
                                            type="text"
                                            name="company_name"
                                            className="form-control"
                                            value={decodeHTMLEntities(jobInfo.company_name)}
                                        />
                                        {errorMessages.company_name && (
                                            <div className="form-text text-danger">{errorMessages.company_name}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Job Role <span className="text-danger">*</span></label>
                                        <input
                                            onChange={changeHandler}
                                            type="text"
                                            name="job_role"
                                            className="form-control"
                                            value={jobInfo.job_role}
                                        />
                                        {errorMessages.job_role && (
                                            <div className="form-text text-danger">{errorMessages.job_role}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Notes</label>
                                        <textarea
                                            name="notes"
                                            className="form-control"
                                            rows={4}
                                            onChange={changeHandler}
                                            value={jobInfo.notes}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Salary</label>
                                        <input
                                            type="text"
                                            name="job_salary"
                                            className="form-control"
                                            onChange={changeHandler}
                                            value={jobInfo.job_salary}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Applied On</label>
                                        <input
                                            readOnly
                                            type="text"
                                            name="date_applied"
                                            className="form-control"
                                            value={new Date(jobInfo.date_applied).toLocaleDateString()}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Application Status</label>
                                        <select className="form-select" aria-label="status" name="app_status" onChange={changeHandler} value={jobInfo.app_status}>
                                            <option value="Applied">Applied</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Interviewed">Interviewed</option>
                                            <option value="Offer">Offer</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer border-0 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-light me-2"
                                data-bs-dismiss="modal"
                                onClick={() => setJobInfo(job)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={e => updateJobInfo(e)}
                                disabled={isDisabled || isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Save changes'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                data-bs-dismiss="modal"
                                onClick={() => { window.confirm('Are you sure you want to delete this Job?') && deleteJob(job.id) }}
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateJobs;