/* eslint-disable react/prop-types */
import * as React from "react";
import {
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
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
import { useEffect, useCallback } from "react";

import { apiget, apipost } from "../../service/api";
import Palette from "../../theme/palette";

const Add = (props) => {
  const { open, handleClose, setUserAction, _id } = props;

  const userid = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("userRole");

  // ----------- Validation schema
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

  // ----------- Initial values
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

  // ----------- API: Add policy
  const addPolicy = async (values) => {
    const result = await apipost("policy/add", values);
    setUserAction(result);

    if (result && result.status === 201) {
      toast.success(result.data.message);
      formik.resetForm();
      handleClose();
    }
  };

  // ----------- Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await addPolicy(values);
    },
  });

  // ----------- API: Fetch related data (if needed)
  const fetchdata = useCallback(async () => {
    await apiget(
      userRole === "admin"
        ? "contact/list"
        : `contact/list/?createdBy=${userid}`
    );
  }, [userid, userRole]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Typography variant="h6">Add New Policy</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {/* 🔹 Mantém aqui todo o conteúdo do formulário (inputs e grids) 
                exatamente como já tinhas — este snippet só limpa estrutura e lógica */}
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