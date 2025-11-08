import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validator from "validator";

const AddJob = ({ setJobsList, refreshJobList }) => {

    const [newJob, setNewJob] = useState({
        company_name: "",
        job_role: "",
        notes: "",
        job_salary: "",
        date_applied: "",
        app_status: "",
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
        }

        setNewJob({
            ...newJob,
            [name]: value
        });
    };

    useEffect(() => {
        if (validator.isLength(newJob.company_name, { min: 1, max: 50 }) && validator.isLength(newJob.job_role, { min: 1, max: 50 })) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [newJob]);

    const handleSubmitClick = async e => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const body = {
                company_name: newJob.company_name,
                job_role: newJob.job_role,
                notes: newJob.notes,
                job_salary: newJob.job_salary,
                date_applied: newJob.date_applied,
                app_status: newJob.app_status,
            };
            const response = await fetch("http://localhost:5000/job", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const text = await response.text().catch(() => 'Unknown error');
                // show user-facing error
                // eslint-disable-next-line no-alert
                alert('Error creating job: ' + text);
                return;
            }

            const data = await response.json();
            setJobsList(prevJobsList => [...prevJobsList, data]);
            refreshJobList();
            setNewJob({
                company_name: "",
                job_role: "",
                notes: "",
                job_salary: "",
                date_applied: "",
                app_status: "",
            });

            // programmatically hide bootstrap modal (if bootstrap is loaded)
            try {
                const modalEl = document.getElementById('addJobModal');
                if (window.bootstrap && modalEl) {
                    const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
                    modalInstance.hide();
                }
            } catch (hideErr) {
                // ignore hide errors
                // eslint-disable-next-line no-console
                console.warn('Could not hide modal programmatically', hideErr);
            }

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Submit error', error);
            // eslint-disable-next-line no-alert
            alert('Network error: ' + (error.message || error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="modal fade" id='addJobModal' data-bs-backdrop="static">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-3 shadow-sm">

                            <div className="modal-header border-0">
                                <h5 className="modal-title">Add Job</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>

                            <div className="modal-body">
                                <form className="container-fluid">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Company Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                className="form-control"
                                                onChange={changeHandler}
                                                value={newJob.company_name}
                                            />
                                            {errorMessages.company_name && (
                                                <div className="form-text text-danger">{errorMessages.company_name}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Job Role <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="job_role"
                                                className="form-control"
                                                onChange={changeHandler}
                                                value={newJob.job_role}
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
                                                value={newJob.notes}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Salary</label>
                                            <input
                                                type="text"
                                                name="job_salary"
                                                className="form-control"
                                                onChange={changeHandler}
                                                value={newJob.job_salary}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Applied On</label>
                                            <input
                                                type="date"
                                                name="date_applied"
                                                className="form-control"
                                                onChange={changeHandler}
                                                value={newJob.date_applied}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Application Status</label>
                                            <select className="form-select" aria-label="status" name="app_status" onChange={changeHandler} value={newJob.app_status}>
                                                <option value="">Select status</option>
                                                <option>Applied</option>
                                                <option>Rejected</option>
                                                <option>Interviewed</option>
                                                <option>Offer</option>
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
                                    onClick={() => setNewJob({ company_name: "", job_role: "", notes: "", job_salary: "", date_applied: "", app_status: "" })}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitClick}
                                    disabled={isDisabled || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Save job'}
                                </button>
                            </div>

                        </div>
                    </div>
            </div>
        </div>
    )
};

AddJob.propTypes = {
    setJobsList: PropTypes.func.isRequired,
};

export default AddJob;