/* eslint-disable react/prop-types */
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import { apiget, apipost } from "../../service/api";

const Addcalls = (props) => {
  const { open, handleClose, _id, setUserAction } = props;
  const [leadData, setLeadData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const userid = localStorage.getItem("user_id");

  // -----------  validationSchema
  const validationSchema = yup.object({
    subject: yup.string().required("Subject is required"),
    status: yup.string().required("Status is required"),
    startDateTime: yup.string().required("Start Date & Time is required"),
    duration: yup.string().required("Duration is required"),
    relatedTo: yup.string().required("Related To is required"),
    note: yup.string().required("Note is required"),
  });

  // -----------   initialValues
  const initialValues = {
    subject: "",
    status: "",
    startDateTime: "",
    duration: "",
    relatedTo: "",
    note: "",
    createdBy: userid,
    lead_id: _id,
    contact_id: _id,
  };

  // add call api
  const addCall = async (values) => {
    const result = await apipost("call/add", values);
    setUserAction(result);

    if (result && result.status === 201) {
      formik.resetForm();
      handleClose();
      toast.success(result.data.message);
    }
  };

  // lead api
  const fetchLeadData = useCallback(async () => {
    const result = await apiget(
      userRole === "admin"
        ? `lead/list`
        : `lead/list/?createdBy=${userid}`
    );
    if (result && result.status === 200) {
      setLeadData(result?.data?.result || []);
    }
  }, [userRole, userid]);

  // contact api
  const fetchContactData = useCallback(async () => {
    const result = await apiget(
      userRole === "admin"
        ? `contact/list`
        : `contact/list/?createdBy=${userid}`
    );
    if (result && result.status === 200) {
      setContactData(result?.data?.result || []);
    }
  }, [userRole, userid]);

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await addCall(values);
      resetForm();
    },
  });

  // ✅ Corrected dependencies
  useEffect(() => {
    fetchLeadData();
    fetchContactData();
  }, [fetchLeadData, fetchContactData]);

  return (
    <Dialog
      open={open}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Create Call</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 0, sm: 5, md: 4 }}
            >
              <Grid item xs={12} sm={6}>
                <FormLabel>Subject</FormLabel>
                <TextField
                  id="subject"
                  name="subject"
                  size="small"
                  fullWidth
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject &&
                    Boolean(formik.errors.subject)
                  }
                  helperText={
                    formik.touched.subject && formik.errors.subject
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Status</FormLabel>
                  <Select
                    id="status"
                    name="status"
                    size="small"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.status &&
                      Boolean(formik.errors.status)
                    }
                  >
                    <MenuItem value="Planned">Planned</MenuItem>
                    <MenuItem value="Held">Held</MenuItem>
                    <MenuItem value="Not Held">Not Held</MenuItem>
                  </Select>
                  <FormHelperText
                    error={
                      formik.touched.status &&
                      Boolean(formik.errors.status)
                    }
                  >
                    {formik.touched.status && formik.errors.status}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Start Date & Time</FormLabel>
                <TextField
                  id="startDateTime"
                  name="startDateTime"
                  size="small"
                  type="datetime-local"
                  fullWidth
                  value={formik.values.startDateTime}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.startDateTime &&
                    Boolean(formik.errors.startDateTime)
                  }
                  helperText={
                    formik.touched.startDateTime &&
                    formik.errors.startDateTime
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    id="duration"
                    name="duration"
                    size="small"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.duration &&
                      Boolean(formik.errors.duration)
                    }
                  >
                    {[
                      "15 minutes",
                      "30 minutes",
                      "45 minutes",
                      "1 hour",
                      "1.5 hours",
                      "2 hours",
                      "3 hours",
                    ].map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={
                      formik.touched.duration &&
                      Boolean(formik.errors.duration)
                    }
                  >
                    {formik.touched.duration && formik.errors.duration}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Related To</FormLabel>
                  <Select
                    id="relatedTo"
                    name="relatedTo"
                    size="small"
                    value={formik.values.relatedTo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.relatedTo &&
                      Boolean(formik.errors.relatedTo)
                    }
                  >
                    <MenuItem value="Lead">Lead</MenuItem>
                    <MenuItem value="Contact">Contact</MenuItem>
                  </Select>
                  <FormHelperText
                    error={
                      formik.touched.relatedTo &&
                      Boolean(formik.errors.relatedTo)
                    }
                  >
                    {formik.touched.relatedTo &&
                      formik.errors.relatedTo}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {formik.values.relatedTo === "Lead" && (
                <Grid item xs={12} sm={6}>
                  <FormLabel>Lead</FormLabel>
                  <Autocomplete
                    id="lead-autocomplete"
                    options={leadData}
                    getOptionLabel={(lead) =>
                      `${lead.firstName} ${lead.lastName}`
                    }
                    value={
                      leadData.find(
                        (lead) => lead._id === formik.values.lead_id
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      formik.setFieldValue(
                        "lead_id",
                        newValue ? newValue._id : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Grid>
              )}

              {formik.values.relatedTo === "Contact" && (
                <Grid item xs={12} sm={6}>
                  <FormLabel>Contact</FormLabel>
                  <Autocomplete
                    id="contact-autocomplete"
                    options={contactData}
                    getOptionLabel={(contact) =>
                      `${contact.firstName} ${contact.lastName}`
                    }
                    value={
                      contactData.find(
                        (c) => c._id === formik.values.contact_id
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      formik.setFieldValue(
                        "contact_id",
                        newValue ? newValue._id : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormLabel>Note</FormLabel>
                <TextField
                  id="note"
                  name="note"
                  size="small"
                  fullWidth
                  rows={4}
                  multiline
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.note && Boolean(formik.errors.note)
                  }
                  helperText={formik.touched.note && formik.errors.note}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          onClick={formik.handleSubmit}
          sx={{ textTransform: "capitalize" }}
          color="secondary"
        >
          Save
        </Button>
        <Button
          type="reset"
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Addcalls;