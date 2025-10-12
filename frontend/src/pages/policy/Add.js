/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { apiget, apipost } from "../../service/api";

// ----------------------------------------------------------------------

const Add = ({ open, handleClose, setUserAction, _id }) => {
  const userid = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("userRole");

  // ✅ Validation Schema
  const validationSchema = yup.object({
    policyType: yup.string().required("Policy Type is required"),
    policyStartDate: yup.date().required("Policy Start Date is required"),
    policyEndDate: yup.date().required("Policy End Date is required"),
    policyStatus: yup.string().required("Policy Status is required"),
    coverageAmounts: yup.number().required("Coverage Amounts is required"),
    deductibles: yup.number().required("Deductions is required"),
    limits: yup.number().required("Limits is required"),
    insuredPersonName: yup.string().required("Person Name is required"),
    insuredPersonDateOfBirth: yup.date().required("Date of Birth is required"),
    relationshipToTheInsured: yup
      .string()
      .required("Relationship To The Insured is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number is invalid")
      .required("Phone number is required"),
    emailAddress: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    additionalPhoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number is invalid")
      .nullable(),
    additionalEmailAddress: yup.string().email("Invalid email").nullable(),
    underwriterPhone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number is invalid")
      .nullable(),
    underwriterEmail: yup.string().email("Invalid email").nullable(),
  });

  // ✅ Initial Values
  const initialValues = {
    policyType: "",
    policyStartDate: "",
    policyEndDate: "",
    policyStatus: "",
    coverageAmounts: "",
    deductibles: "",
    limits: "",
    insuredPersonName: "",
    insuredPersonDateOfBirth: "",
    phoneNumber: "",
    emailAddress: "",
    instagramProfile: "",
    twitterProfile: "",
    relationshipToTheInsured: "",
    additionalInsuredPersonName: "",
    additionalInsuredDateOfBirth: "",
    additionalRelationshipToTheInsured: "",
    additionalPhoneNumber: "",
    additionalEmailAddress: "",
    additionalInstagramProfile: "",
    additionalTwitterProfile: "",
    premiumAmount: "",
    FrequencyOfPremiumPayments: "",
    underwriterName: "",
    underwriterPhone: "",
    underwriterEmail: "",
    underwriterDecisions: "",
    createdBy: userid,
    contact_id: _id,
    assigned_agent: userid,
  };

  // ✅ Add Policy API
  const addPolicy = async (values) => {
    const result = await apipost("policy/add", values);
    setUserAction(result);
    if (result && result.status === 201) {
      toast.success(result.data.message);
      formik.resetForm();
      handleClose();
    }
  };

  // ✅ Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: addPolicy,
  });

  // ✅ Fetch Contacts (for potential future use)
  const fetchData = useCallback(async () => {
    await apiget(
      userRole === "admin"
        ? "contact/list"
        : `contact/list/?createdBy=${userid}`
    );
  }, [userid, userRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="add-policy-title"
      aria-describedby="add-policy-description"
    >
      <DialogTitle
        id="add-policy-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Add New Policy</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="add-policy-description" tabIndex={-1}>
            {/* 🧩 Mantém aqui o conteúdo do formulário original 
                (inputs, grids, selects, etc.) */}
          </DialogContentText>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Add;